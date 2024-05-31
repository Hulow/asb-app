import { injectable } from 'inversify'
import { RegisterFrequencyInput } from '../../ports/in/register-frequency.input-port'
import { RegisterFrequencyCommand } from './register-frequency.command'
import { FrequencyProps } from '../../../domain/frequency/frequency'
import { FrequencyParameterNotFound } from '../../../domain/frequency/errors'

interface FrequencyResponse {
  frequencies: number[]
  spls: number[]
  phases: number[]
}

interface extremSpls {
  highestSpl: number
  lowestSpl: number
}

@injectable()
export class RegisterFrequencyMapper {
  mapFrequency(command: RegisterFrequencyCommand): FrequencyProps {
    const [parameters, data] = command.measurements.split(PATTERN)
    const mappedParameters = this.mapParameters(parameters)
    const frequencyResponse = this.mapFrequencyResponse(data)
    const extremSpls = this.getExtremSpls(frequencyResponse.spls)
    return this.mapFrequencyProps(
      command.cabinetUid,
      mappedParameters,
      frequencyResponse,
      extremSpls,
    )
  }

  private mapParameters(rawParameters: string): FrequencyProps {
    const mappedParameters = new Map()
    const parameters = rawParameters.split('\n')
    for (const parameterNameAndPattern of PARAMETERS_AND_PATTERNS) {
      const parameter = this.mapSingleParameter(
        parameterNameAndPattern,
        parameters,
      )
      mappedParameters.set(parameter.name, parameter.value)
    }
    return Object.fromEntries(mappedParameters) as FrequencyProps
  }

  private mapSingleParameter(
    parameterNameAndPattern: ParametersAndPattern,
    parameters: string[],
  ): {
    name: FrequencyParametersName
    value: string
  } {
    for (const parameter of parameters) {
      const matchedParameter = this.matchParameter(
        parameter,
        parameterNameAndPattern.pattern,
      )
      if (matchedParameter) {
        return {
          name: parameterNameAndPattern.name,
          value: matchedParameter.trim(),
        }
      }
    }
    throw new FrequencyParameterNotFound(parameterNameAndPattern.name)
  }

  private matchParameter(
    parameter: string,
    parameterPattern: RegExp,
  ): string | undefined {
    const match = parameter.match(parameterPattern)
    return match?.length ? match[0] : undefined
  }

  private mapFrequencyResponse(data: string): FrequencyResponse {
    const measurements = data.split('\n')
    measurements.shift()
    const frequencies = []
    const spls = []
    const phases = []
    for (const measurement of measurements) {
      const frequencyAndSoundPressureAndPhase = measurement.split(' ')
      if (frequencyAndSoundPressureAndPhase.length === 3) {
        const [frequency, SPL, phase] = frequencyAndSoundPressureAndPhase
        frequencies.push(Number(frequency))
        spls.push(Number(SPL))
        phases.push(Number(phase))
      }
    }

    return { frequencies, spls, phases }
  }

  private getExtremSpls(spls: number[]): extremSpls {
    let lowestSpl = spls[0]
    let highestSpl = spls[0]
    for (const spl of spls) {
      if (spl <= lowestSpl) {
        lowestSpl = spl
      }
      if (spl >= lowestSpl) {
        highestSpl = spl
      }
    }
    return { lowestSpl, highestSpl }
  }

  private mapFrequencyProps(
    cabinetUid: string,
    mappedParameters: FrequencyProps,
    frequencyResponse: FrequencyResponse,
    extremSpls: extremSpls,
  ): FrequencyProps {
    return {
      measuredBy: mappedParameters.measuredBy,
      source: mappedParameters.source,
      sweepLength: mappedParameters.sweepLength,
      measuredAt: mappedParameters.measuredAt,
      frequencyWeightings: mappedParameters.frequencyWeightings,
      targetLevel: mappedParameters.targetLevel,
      note: mappedParameters.note,
      smoothing: mappedParameters.smoothing,
      frequencies: frequencyResponse.frequencies,
      spls: frequencyResponse.spls,
      highestSpl: extremSpls.highestSpl,
      lowestSpl: extremSpls.lowestSpl,
      phases: frequencyResponse.phases,
      cabinetUid: cabinetUid,
    }
  }
}

const PATTERN = '*\n'

const frequencyParameterPatterns = {
  measuredBy: /(?<=measured by ).*/,
  source: /(?<=Source: ).*USB/,
  sweepLength: /(?<=Format: ).*Sine/,
  measuredAt: /(?<=Dated: ).*/,
  frequencyWeightings: / .*-weighting/,
  targetLevel: /(?<=Target level: ).*/,
  note: /(?<=Note: ).*/,
  smoothing: /(?<=Smoothing: ).*/,
}

enum FrequencyParametersName {
  MeasuredBy = 'measuredBy',
  Source = 'source',
  SweepLength = 'sweepLength',
  MeasuredAt = 'measuredAt',
  FrequencyWeightings = 'frequencyWeightings',
  TargetLevel = 'targetLevel',
  Note = 'note',
  Smoothing = 'smoothing',
}
interface ParametersAndPattern {
  name: FrequencyParametersName
  pattern: RegExp
}
const PARAMETERS_AND_PATTERNS: ParametersAndPattern[] = [
  {
    name: FrequencyParametersName.MeasuredBy,
    pattern: frequencyParameterPatterns.measuredBy,
  },
  {
    name: FrequencyParametersName.Source,
    pattern: frequencyParameterPatterns.source,
  },
  {
    name: FrequencyParametersName.SweepLength,
    pattern: frequencyParameterPatterns.sweepLength,
  },
  {
    name: FrequencyParametersName.MeasuredAt,
    pattern: frequencyParameterPatterns.measuredAt,
  },
  {
    name: FrequencyParametersName.FrequencyWeightings,
    pattern: frequencyParameterPatterns.frequencyWeightings,
  },
  {
    name: FrequencyParametersName.TargetLevel,
    pattern: frequencyParameterPatterns.targetLevel,
  },
  {
    name: FrequencyParametersName.Note,
    pattern: frequencyParameterPatterns.note,
  },
  {
    name: FrequencyParametersName.Smoothing,
    pattern: frequencyParameterPatterns.smoothing,
  },
]
