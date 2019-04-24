import { IntentParser, HenryIntent, UnknownIntent, DataLoadIntent } from "./intents";




function parse(msg: string): HenryIntent {
    if (msg.toLowerCase().search(/(data|load|find)/) >= 0) {
        return new DataLoadIntent(msg, null, null)
    }
    return new UnknownIntent(msg)
}
export class RegExpIntentParser implements IntentParser {
    getIntent(msg: string): Promise<HenryIntent> {
        return Promise.resolve(parse(msg))
    }
}