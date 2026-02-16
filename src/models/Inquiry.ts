import { Schema, model, models } from 'mongoose';

const InquirySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 255,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Inquiry = models.Inquiry || model('Inquiry', InquirySchema);

export default Inquiry;
