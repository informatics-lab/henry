
import * as yaml from 'js-yaml';

const TOP_LEVEL_CAT = 'https://s3.eu-west-2.amazonaws.com/aws-earth-mo-intake-catalogs/mo_aws_earth.yaml'

let cubes: HypotheticCubeDesc[] = [];
export function getCats() {
    addCat('aws_earth', TOP_LEVEL_CAT)
}

function addCat(key: string, url: string) {
    console.info(`Gettting cat ${url}`)
    fetch(url).then(res => res.text()).then(text => yaml.load(text)).then((cat) => parseCat(key, cat))
}

function parseCat(srcKey: string, cat: any) {
    for (let key of Object.keys(cat.sources)) {
        let source = cat.sources[key]
        if (source.driver == "intake.catalog.local.YAMLFileCatalog") {
            addCat(`${srcKey}.${key}`, source.args.path)
        } else if (source.driver == "hypothetic") {
            addEntry(key, source)
        } else {
            console.log(`don't know how to deal with source with driver ${source.driver}`)
        }

    }
}

function addEntry(key: string, entry: any) {
    try {
        let cube: HypotheticCubeDesc = {
            key: key,
            description: entry.description,
            name: entry.args.metadata.name,
            forecast_period: entry.args.metadata.forecast_period,
            model: entry.args.metadata.model,
        }
        cubes.push(cube)
    } catch (error) {
        console.warn(`couldn't add to data cat:`, error, entry)
    }

}

interface HypotheticCubeDesc {
    key: string
    description: string
    name: string
    forecast_period: number[]
    model: "mo-atmospheric-global-prd" | "mo-atmospheric-mogreps-uk-prd" | "mo-atmospheric-mogreps-g-prd" | "mo-atmospheric-ukv-prd"
    cell_methods?: string

}

export function findCubes(param: string = null, model: string = null): HypotheticCubeDesc[] {
    console.log("in find cubes", param, model)
    function clean(dirty: string) {
        if (!dirty) {
            return dirty
        }
        return dirty.toLocaleLowerCase().replace(/[ -_]*/g, '')
    }
    param = clean(param)
    model = clean(model)
    return cubes.filter((cube) => {
        if (!param) {
            return true
        }
        return clean(cube.name).search(param) >= 0 || clean(cube.description).search(param) >= 0
    }).filter((cube) => {
        if (!model) {
            return true
        }
        return clean(cube.model).search(model) >= 0
    })
}