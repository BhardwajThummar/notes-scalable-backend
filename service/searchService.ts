import Note from '../models/note';

// search notes
export const searchNotes = async (userId: string, query: string) => {
    try {
        const notes = await Note.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ],
            userId
        });
        return {
            data: notes,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error searchNotes :>>",error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}