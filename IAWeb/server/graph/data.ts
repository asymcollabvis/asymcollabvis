import data from "./miserables.json" assert { type: 'json' };
// let data: {
//     links: {
//         source: number;
//         target: number;
//         value: number;
//     }[];
//     nodes: {
//         id: number;
//         name: string;
//         group: number;
//     }[];
// } = require("./miserables.json");

// import template from "./g7c1.json" assert { type: 'json' };

function getData() {
    // let _data = {
    //     links: data.links,
    //     nodes: data.nodes.map((d, i) => ({ ...d, id: i }))
    // }
    let _data = {
        links: [],
        nodes: []
    }
    return _data
    // return template
}

export { getData }