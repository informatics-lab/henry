import { IntentParser, HenryIntent, UnknownIntent, DataLoadIntent, GreetingIntent, ThankyouIntent } from "./intents";




function parse(msg: string): HenryIntent {

    let dataRegEx = /(data|load|find) ([^ ]*) .*(for|from|model) ([^ ]*)/
    let match = msg.toLowerCase().match(dataRegEx)
    if (match) {
        return new DataLoadIntent(msg, match[4], match[2])
    }

    let greetingRegEx = /(hi|hey|hello)/
    // let match = msg.toLowerCase().match(greetingRegEx)
    if (match = msg.toLowerCase().match(greetingRegEx)) {
        return new GreetingIntent(msg)
    }

    let thankyouRegEx = /(thanks|thank you|thankyou|cheers|ta)/
    // let match = msg.toLowerCase().match(greetingRegEx)
    if (match = msg.toLowerCase().match(thankyouRegEx)) {
        return new ThankyouIntent(msg)
    }

    // return greeting intent
    return new UnknownIntent(msg)
}


export class RegExpIntentParser implements IntentParser {
    getIntent(msg: string): Promise<HenryIntent> {
        return Promise.resolve(parse(msg))
    }
}