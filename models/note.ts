import { Document, Schema, Model, model } from 'mongoose';

interface INote {
  title: string;
  content: string;
  userId: Schema.Types.ObjectId;
  sharedWith?: Schema.Types.ObjectId[];
  isShared?: boolean;
  isDeleted?: boolean;
}

export interface INoteDocument extends INote, Document { }

export interface INoteModel extends Model<INoteDocument> { }

const noteSchema = new Schema<INoteDocument, INoteModel>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isDeleted: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
}, {
  timestamps: true
});

// Enable text indexing for search functionality
noteSchema.index({ title: 'text', content: 'text' });

const Note: INoteModel = model<INoteDocument, INoteModel>('Note', noteSchema);

export default Note;
