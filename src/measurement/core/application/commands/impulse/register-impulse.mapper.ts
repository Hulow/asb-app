import { ImpulseSettingNotFound } from '../../../domain/impulse/errors';
import { ImpulseGraph, ImpulseProps } from '../../../domain/impulse/impulse';
import { RegisterImpulseCommand } from './register-impulse.command';

export class RegisterImpulseMapper {
  mapImpulse(command: RegisterImpulseCommand): ImpulseProps {
    const [settings, data] = command.measurements.split(PATTERN);
    const mappedSettings = this.mapSettings(settings);
    const impulseGraph = this.mapImpulseGraphData(data, mappedSettings);
    return this.mapImpulseObject(mappedSettings, impulseGraph, command.cabinetUid);
  }

  private mapSettings(data: string): ImpulseProps {
    const settings = data.split('\n');
    const mappedSettings = new Map();
    for (const settingNameAndPattern of SETTING_NAME_AND_PATTERNS) {
      const setting = this.mapSingleSetting(settingNameAndPattern, settings);
      mappedSettings.set(setting.name, setting.value);
    }
    return Object.fromEntries(mappedSettings) as ImpulseProps;
  }

  private mapSingleSetting(
    settingNameAndPattern: SettingNameAndPattern,
    measurementSettings: string[],
  ): {
    name: SettingKeyNames;
    value: string;
  } {
    for (const setting of measurementSettings) {
      const matchedSetting = this.matchSetting(setting, settingNameAndPattern.pattern);
      if (matchedSetting) {
        return { name: settingNameAndPattern.name, value: matchedSetting.trim() };
      }
    }
    throw new ImpulseSettingNotFound(settingNameAndPattern.name);
  }

  private matchSetting(setting: string, settingPattern: RegExp): string | undefined {
    const match = setting.match(settingPattern);
    if (match?.length) return match[0];
    return undefined;
  }

  private mapImpulseGraphData(data: string, mappedSettings: ImpulseProps) {
    const impulseGraphData = data.split('\n');
    const { sampleInterval, startTime } = mappedSettings;
    const impulseGraphTimeLine = this.getImpulseGraphTimeLine(
      impulseGraphData,
      Number(sampleInterval),
      Number(startTime),
    );
    return this.mapTimeAndDecibel(impulseGraphTimeLine, impulseGraphData);
  }

  private getImpulseGraphTimeLine(impulseGraphData: string[], sampleInterval: number, startTime: number) {
    const impulseGraphTimeLine: number[] = [];
    impulseGraphTimeLine.push(startTime);
    impulseGraphData.map(() => this.addNewTimeEntry(impulseGraphTimeLine, sampleInterval));
    return impulseGraphTimeLine;
  }

  private addNewTimeEntry(impulseGraphTimeLine: number[], sampleInterval: number) {
    const lastTimeEntry: number = impulseGraphTimeLine[impulseGraphTimeLine.length - 1];
    const newTimeEntry = lastTimeEntry + sampleInterval;
    return impulseGraphTimeLine.push(newTimeEntry);
  }

  private mapTimeAndDecibel(impulseGraphTimeLine: number[], impulseGraphData: string[]): ImpulseGraph[] {
    let counter = 0;
    const impulseGraph = [];
    for (const data of impulseGraphData) {
      const impulse: ImpulseGraph = { dbfs: Number(data), time: impulseGraphTimeLine[counter] };
      ++counter;
      impulseGraph.push(impulse);
    }
    return impulseGraph;
  }

  private mapImpulseObject(
    mappedMeasurementSettings: ImpulseProps,
    mappedImpulseGraphData: ImpulseGraph[],
    cabinetUid: string,
  ) {
    return {
      measuredBy: mappedMeasurementSettings.measuredBy,
      note: mappedMeasurementSettings.note,
      source: mappedMeasurementSettings.source,
      measuredAt: mappedMeasurementSettings.measuredAt,
      sweepLength: mappedMeasurementSettings.sweepLength,
      responseWindow: mappedMeasurementSettings.responseWindow,
      measurements: mappedImpulseGraphData,
      peakValueBeforeInitialization: mappedMeasurementSettings.peakValueBeforeInitialization,
      peakIndex: mappedMeasurementSettings.peakIndex,
      responseLength: mappedMeasurementSettings.responseLength,
      sampleInterval: mappedMeasurementSettings.sampleInterval,
      startTime: mappedMeasurementSettings.startTime,
      cabinetUid: cabinetUid,
    };
  }
}

const PATTERN = '* Data start\n';

const settingPaterns = {
  measuredBy: /(?<=saved by ).*/,
  source: /(?<=Source: ).*USB/,
  sweepLength: /(?<=Excitation: ).*Sine/,
  measuredAt: /(?<=Dated: ).*/,
  responseWindow: /(?<=Response measured over: ).*/,
  note: /(?<=Note: ).*/,
  peakValueBeforeInitialization: /[\s\S]*?(?= \/\/ Peak value before normalisation)/,
  peakIndex: /[\s\S]*?(?= \/\/ Peak index)/,
  responseLength: /[\s\S]*?(?= \/\/ Response length)/,
  sampleInterval: /[\s\S]*?(?= \/\/ Sample interval)/,
  startTime: /[\s\S]*?(?= \/\/ Start time)/,
};

enum SettingKeyNames {
  MeasuredBy = 'measuredBy',
  Source = 'source',
  SweepLength = 'sweepLength',
  MeasuredAt = 'measuredAt',
  ResponseWindow = 'responseWindow',
  Note = 'note',
  PeakValueBeforeInitialization = 'peakValueBeforeInitialization',
  PeakIndex = 'peakIndex',
  ResponseLength = 'responseLength',
  SampleInterval = 'sampleInterval',
  StartTime = 'startTime',
}

interface SettingNameAndPattern {
  name: SettingKeyNames;
  pattern: RegExp;
}

const SETTING_NAME_AND_PATTERNS: SettingNameAndPattern[] = [
  { name: SettingKeyNames.MeasuredBy, pattern: settingPaterns.measuredBy },
  { name: SettingKeyNames.Source, pattern: settingPaterns.source },
  { name: SettingKeyNames.SweepLength, pattern: settingPaterns.sweepLength },
  { name: SettingKeyNames.MeasuredAt, pattern: settingPaterns.measuredAt },
  { name: SettingKeyNames.ResponseWindow, pattern: settingPaterns.responseWindow },
  { name: SettingKeyNames.Note, pattern: settingPaterns.note },
  { name: SettingKeyNames.PeakValueBeforeInitialization, pattern: settingPaterns.peakValueBeforeInitialization },
  { name: SettingKeyNames.PeakIndex, pattern: settingPaterns.peakIndex },
  { name: SettingKeyNames.ResponseLength, pattern: settingPaterns.responseLength },
  { name: SettingKeyNames.SampleInterval, pattern: settingPaterns.sampleInterval },
  { name: SettingKeyNames.StartTime, pattern: settingPaterns.startTime },
];
