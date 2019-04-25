import { IntentParser, HenryIntent, UnknownIntent, DataLoadIntent } from "./intents";




function parse(msg: string): HenryIntent {

    let dataRegEx = /(data|load|find) ([^ ]*) .*(for|from|model) ([^ ]*)/
    let match = msg.toLowerCase().match(dataRegEx)
    if (match) {
        return new DataLoadIntent(msg, match[4], match[2])
    }
    return new UnknownIntent(msg)
}


export class RegExpIntentParser implements IntentParser {
    getIntent(msg: string): Promise<HenryIntent> {
        return Promise.resolve(parse(msg))
    }
}