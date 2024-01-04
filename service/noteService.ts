import Note from '../models/note';

// getAllNotes
export const getAllNotes = async (userId: string) => {
    try {
        const notes = await Note.find({
            $or: [
                { userId: userId },
                { isShared: true }
            ],
        });
        return {
            data: notes,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error getAllNotes :>>", error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}

// getNoteById
export const getNoteById = async (userId: string, noteId: string) => {
    try {
        const note = await Note.findOne(
            {
                $or: [
                    { userId: userId },
                    // { sharedWith: userId }
                    { isShared: true }
                ],
                // userId: userId,
                _id: noteId
            });
        return {
            data: note,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error getNoteById :>>", error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}

// createNote
export const createNote = async (userId: string, title: string, content: string) => {
    try {
        const note = new Note({
            userId: userId,
            title: title,
            content: content
        });
        return await note.save();
    } catch (error) {
        console.error("error createNote :>>", error);
        return error;
    }
}

// updateNote
export const updateNote = async (userId: string, noteId: string, title: string, content: string) => {
    try {
        const updateData: any = {};
        if (title) updateData['title'] = title;
        if (content) updateData['content'] = content;
        const note = await Note.findOneAndUpdate({
            userId: userId,
            _id: noteId
        }, updateData, {
            new: true
        });
        return {
            data: note,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error updateNote :>> ", error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}

// deleteNote
export const deleteNote = async (userId: string, noteId: string) => {
    try {
        const note = await Note.findOneAndUpdate({
            userId: userId,
            _id: noteId
        }, {
            isDeleted: true
        }, {
            new: true
        });
        return {
            data: note,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error deleteNote :>>", error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}

// shareNote
export const shareNote = async (userId: string, noteId: string, sharedWith: string) => {
    try {
        const note = await Note.findOneAndUpdate({
            userId: userId,
            _id: noteId
        }, {
            // will update this later

            // $addToSet: {
            //     sharedWith: sharedWith
            // },
            isShared: true
        }, {
            new: true
        });

        if (!note) return {
            data: null,
            status: 404,
            message: 'Note not found'
        }

        return {
            data: note,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error shareNote :>>", error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}
