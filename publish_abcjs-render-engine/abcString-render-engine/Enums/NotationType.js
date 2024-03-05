export var NotationType;
(function (NotationType) {
    NotationType[NotationType["Unknow"] = 0] = "Unknow";
    NotationType[NotationType["Note"] = 1] = "Note";
    NotationType[NotationType["ChordNote"] = 2] = "ChordNote";
    NotationType[NotationType["RestNote"] = 3] = "RestNote";
    NotationType[NotationType["BarLine"] = 4] = "BarLine";
    NotationType[NotationType["InfoField"] = 5] = "InfoField";
    NotationType[NotationType["IninlineInfoField"] = 6] = "IninlineInfoField";
    NotationType[NotationType["SlursBoundary"] = 7] = "SlursBoundary";
})(NotationType || (NotationType = {}));
//# sourceMappingURL=NotationType.js.map