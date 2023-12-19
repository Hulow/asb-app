import { injectable } from 'inversify';
import { RegisterFrequencyInput } from '../../core/application/ports/in/register-frequency.input-port';
import { FrequencyMapperOutputPort } from '../../core/application/ports/out/frequency.mapper.output-port';
import { FrequencyParameterNotFound } from '../../core/domain/errors';
import { FrequencyProps, FrequencyResponse } from '../../core/domain/frequency';

@injectable()
export class FrequencyMapper implements FrequencyMapperOutputPort {
  mapFrequency(input: RegisterFrequencyInput): FrequencyProps {
    const [parameters, data] = input.measurements.split(PATTERN);
    const mappedParameters = this.mapParameters(parameters);
    const frequencyResponse = this.mapFrequencyResponse(data);
    return this.mapFrequencyObject(input.cabinetUid, mappedParameters, frequencyResponse);
  }

  private mapParameters(rawParameters: string): FrequencyProps {
    const mappedParameters = new Map();
    const parameters = rawParameters.split('\n');
    for (const parameterNameAndPattern of PARAMETERS_AND_PATTERNS) {
      const parameter = this.mapSingleParameter(parameterNameAndPattern, parameters);
      mappedParameters.set(parameter.name, parameter.value);
    }
    return Object.fromEntries(mappedParameters) as FrequencyProps;
  }

  private mapSingleParameter(
    parameterNameAndPattern: ParametersAndPattern,
    parameters: string[],
  ): {
    name: FrequencyParametersName;
    value: string;
  } {
    for (const parameter of parameters) {
      const matchedParameter = this.matchParameter(parameter, parameterNameAndPattern.pattern);
      if (matchedParameter) {
        return { name: parameterNameAndPattern.name, value: matchedParameter.trim() };
      }
    }
    throw new FrequencyParameterNotFound(parameterNameAndPattern.name);
  }

  private matchParameter(parameter: string, parameterPattern: RegExp): string | undefined {
    const match = parameter.match(parameterPattern);
    return match?.length ? match[0] : undefined;
  }

  private mapFrequencyResponse(data: string): FrequencyResponse[] {
    const measurements = data.split('\n');
    measurements.shift();
    const frequencyResponse: FrequencyResponse[] = [];
    for (const measurement of measurements) {
      const frequencyAndSoundPressureAndPhase = measurement.split(' ');
      if (frequencyAndSoundPressureAndPhase.length === 3)
        frequencyResponse.push(this.mapFrequencyAndSoundPressureAndPhase(frequencyAndSoundPressureAndPhase));
    }
    return frequencyResponse;
  }

  private mapFrequencyAndSoundPressureAndPhase(frequencyAndSoundPressureAndPhase: string[]): FrequencyResponse {
    return {
      frequency: Number(frequencyAndSoundPressureAndPhase[0]),
      spl: Number(frequencyAndSoundPressureAndPhase[1]),
      phase: Number(frequencyAndSoundPressureAndPhase[2]),
    };
  }

  private mapFrequencyObject(
    cabinetUid: string,
    mappedParameters: FrequencyProps,
    frequencyResponse: FrequencyResponse[],
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
      measurements: frequencyResponse,
      cabinetUid: cabinetUid,
    };
  }
}

const PATTERN = '*\n';

const frequencyParameterPatterns = {
  measuredBy: /(?<=measured by ).*/,
  source: /(?<=Source: ).*USB/,
  sweepLength: /(?<=Format: ).*Sine/,
  measuredAt: /(?<=Dated: ).*/,
  frequencyWeightings: / .*-weighting/,
  targetLevel: /(?<=Target level: ).*/,
  note: /(?<=Note: ).*/,
  smoothing: /(?<=Smoothing: ).*/,
};

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
  name: FrequencyParametersName;
  pattern: RegExp;
}
const PARAMETERS_AND_PATTERNS: ParametersAndPattern[] = [
  { name: FrequencyParametersName.MeasuredBy, pattern: frequencyParameterPatterns.measuredBy },
  { name: FrequencyParametersName.Source, pattern: frequencyParameterPatterns.source },
  { name: FrequencyParametersName.SweepLength, pattern: frequencyParameterPatterns.sweepLength },
  { name: FrequencyParametersName.MeasuredAt, pattern: frequencyParameterPatterns.measuredAt },
  {
    name: FrequencyParametersName.FrequencyWeightings,
    pattern: frequencyParameterPatterns.frequencyWeightings,
  },
  { name: FrequencyParametersName.TargetLevel, pattern: frequencyParameterPatterns.targetLevel },
  { name: FrequencyParametersName.Note, pattern: frequencyParameterPatterns.note },
  { name: FrequencyParametersName.Smoothing, pattern: frequencyParameterPatterns.smoothing },
];
