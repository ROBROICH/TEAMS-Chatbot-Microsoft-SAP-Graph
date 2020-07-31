import { Activity, PagedResult, TranscriptInfo, TranscriptStore } from 'botbuilder-core';
/**
 * The file transcript store stores transcripts in file system with each activity as a file.
 *
 * @remarks
 * This class provides an interface to log all incoming and outgoing activities to the filesystem.
 * It implements the features necessary to work alongside the TranscriptLoggerMiddleware plugin.
 * When used in concert, your bot will automatically log all conversations.
 *
 * Below is the boilerplate code needed to use this in your app:
 * ```javascript
 * const { FileTranscriptStore, TranscriptLoggerMiddleware } = require('botbuilder');
 *
 * adapter.use(new TranscriptLoggerMiddleware(new FileTranscriptStore(__dirname + '/transcripts/')));
 * ```
 */
export declare class FileTranscriptStore implements TranscriptStore {
    private static readonly PageSize;
    private readonly rootFolder;
    /**
     * Creates an instance of FileTranscriptStore.
     * @param folder Root folder where transcript will be stored.
     */
    constructor(folder: string);
    /**
     * Log an activity to the transcript.
     * @param activity Activity being logged.
     */
    logActivity(activity: Activity): Promise<void>;
    /**
     * Get all activities associated with a conversation id (aka get the transcript).
     * @param channelId Channel Id.
     * @param conversationId Conversation Id.
     * @param continuationToken (Optional) Continuation token to page through results.
     * @param startDate (Optional) Earliest time to include.
     */
    getTranscriptActivities(channelId: string, conversationId: string, continuationToken?: string, startDate?: Date): Promise<PagedResult<Activity>>;
    /**
     * List all the logged conversations for a given channelId.
     * @param channelId Channel Id.
     * @param continuationToken (Optional) Continuation token to page through results.
     */
    listTranscripts(channelId: string, continuationToken?: string): Promise<PagedResult<TranscriptInfo>>;
    /**
     * Delete a conversation and all of it's activities.
     * @param channelId Channel Id where conversation took place.
     * @param conversationId Id of the conversation to delete.
     */
    deleteTranscript(channelId: string, conversationId: string): Promise<void>;
    private saveActivity;
    private getActivityFilename;
    private getChannelFolder;
    private getTranscriptFolder;
    private sanitizeKey;
}
