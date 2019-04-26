import { IntentParser, HenryIntent, UnknownIntent, DataLoadIntent, CreateClusterIntent, GreetingIntent, ThankyouIntent } from "./intents";



const LOAD_DATA_REGEX = /(data|load|find) ([^ ]*) .*(for|from|model) ([^ ]*)/i
const CLUSTER_REGEX = /(start|need|want|create|build|make).*cluster/i
const CLUSTER_SIZE_REGEX = /(min|max)( size)? ([0-9]+)/ig

function parse(msg: string): HenryIntent {

    let match = msg.match(LOAD_DATA_REGEX)
    if (match) {
        return new DataLoadIntent(msg, match[4], match[2])
    }

    if (msg.match(CLUSTER_REGEX)) {
        let min: number = null
        let max: number = null
        let sizeMatch = null;
        while ((sizeMatch = CLUSTER_SIZE_REGEX.exec(msg)) !== null) {
            if (sizeMatch[1].toLocaleLowerCase() == 'min') {
                min = parseInt(sizeMatch[3])
            } else if (sizeMatch[1].toLocaleLowerCase() == 'max') {
                max = parseInt(sizeMatch[3])
            }
        }
        return new CreateClusterIntent(msg, min, max)
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