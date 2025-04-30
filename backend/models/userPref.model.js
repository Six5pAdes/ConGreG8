import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    size: { type: Integer, required: true },
    ageGroup: { type: String, enum: ['family', 'youngAdult', 'adult', 'senior'], required: true },
    ethnicity: { type: String, enum: ['africanAmerican', 'asian', 'caucasian', 'hispanic', 'nativeAmerican', 'pacificIslander', 'other'], required: true },
    language: { type: String, enum: ['english', 'spanish', 'french', 'german', 'mandarin', 'arabic', 'other'], required: true },
    denomination: { type: String, enum: ['baptist', 'catholic', 'evangelical', 'lutheran', 'methodist', 'orthodox', 'pentecostal', 'presbyterian', 'non-denominational'], required: true },
    serving: { type: String, enum: ['yes', 'no'], default: 'no' },
    serviceTime: { type: String, enum: ['morning', 'afternoon', 'evening'], required: true },
    serviceType: { type: String, enum: ['traditional', 'contemporary', 'blended'], required: true },
    worshipStyle: { type: String, enum: ['liturgical', 'charismatic', 'evangelical', 'traditional'], required: true },
    musicStyle: { type: String, enum: ['traditional', 'contemporary', 'gospel', 'hymns'], required: true },
}, {
    timestamps: true
});

export default mongoose.model('UserPreference', userPreferenceSchema);
