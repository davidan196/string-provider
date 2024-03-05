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
export declare enum NoteDuration {
    Whole = "64",
    Half_dot3 = "60",
    Half_dot2 = "56",
    Half_dot1 = "48",
    Half = "32",
    Quarter_dot3 = "30",
    Quarter_dot2 = "28",
    Quarter_dot1 = "24",
    Quarter = "16",
    Eighth_dot2 = "14",
    Eighth_dot1 = "12",
    Eighth = "8",
    Sixteenth_dot2 = "7",
    Sixteenth_dot1 = "6",
    Sixteenth = "4",
    Thirty_Second = "2"
}
