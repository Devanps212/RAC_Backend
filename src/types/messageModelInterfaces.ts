
export interface conversationInterface {
    _id?:string
    participants: Array<string>;
    messages: Array<string> | messageInterface
}

export interface messageInterface {
    _id?:string
    senderId?: string,
    recieverId?: string,
    message?: string
}