/**
 * 音符的时值 （真正渲染出来还取决于 L: 的值）
 *
 * @description 默认使用 L=1/16 ,且 音符 pitch 是 A 的情况
 * ```ts
 * //            ↓ 十六分音符 (数字就代表增加几个 十六分音符的时间)
 * //                  ↓ 八分音符 附点
 * // A/4 A/2 A/ A A2 A3 A4 A6 A7 A8 A12 A15
 * //      ↑ 三十二分音符
 * ```
 * @description 现在使用 L=1/64
 */
export var NoteDuration;
(function (NoteDuration) {
    NoteDuration["Whole"] = "64";
    NoteDuration["Half_dot3"] = "60";
    NoteDuration["Half_dot2"] = "56";
    NoteDuration["Half_dot1"] = "48";
    NoteDuration["Half"] = "32";
    NoteDuration["Quarter_dot3"] = "30";
    NoteDuration["Quarter_dot2"] = "28";
    NoteDuration["Quarter_dot1"] = "24";
    NoteDuration["Quarter"] = "16";
    NoteDuration["Eighth_dot2"] = "14";
    NoteDuration["Eighth_dot1"] = "12";
    NoteDuration["Eighth"] = "8";
    NoteDuration["Sixteenth_dot2"] = "7";
    NoteDuration["Sixteenth_dot1"] = "6";
    NoteDuration["Sixteenth"] = "4";
    NoteDuration["Thirty_Second"] = "2";
})(NoteDuration || (NoteDuration = {}));
//# sourceMappingURL=NoteDuration.js.map