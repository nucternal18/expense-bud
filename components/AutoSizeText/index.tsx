import * as React from "react";

import Group from "./Group";
import MaxLines from "./MaxLines";
import MinFontSize from "./MinFontSize";
import OverflowReplacement from "./OverflowReplacement";
import PresetFontSizes from "./PresetFontSizes";
import StepGranularity from "./StepGranularity";
import { SelectedModeProps } from "./types";


export const AutoSizeText = ({ ...props }: SelectedModeProps) => {
  const selectedMode = props.mode as string;

  const Modes: any = {
    max_lines: <MaxLines {...props} />,
    min_font_size: <MinFontSize {...props} />,
    preset_font_sizes: <PresetFontSizes {...props} />,
    overflow_replacement: <OverflowReplacement {...props} />,
    step_granularity: <StepGranularity {...props} />,
    group: <Group {...props} />,
    default: <MaxLines {...props} />,
  };

  return Modes[selectedMode] || Modes.default;
};
