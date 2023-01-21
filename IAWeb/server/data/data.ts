import * as fs from "fs/promises";
import * as xml2js from "xml2js";

import seedrandom from "seedrandom";
import _lodash from "lodash"; // Temporary name for Lodash

seedrandom("dev", { global: true });
const _ = _lodash.runInContext();

const parser = new xml2js.Parser();

export type DocumentData = {
  id: string;
  file: string;
  content: string;
  title: string;
  author?: string;
  date: string;
};
export let documents: { [dataset: string]: DocumentData[] } = {};

// training data from https://storiesforkidsbedtime.com/bedtime-detective-stories-for-kids/
const DATA_DIR_TRAIN = "./data/training";

export function loadDocumentsTraining() {
  console.log("Loading training documents");

  return fs
    .readdir(DATA_DIR_TRAIN)
    .then((files) => {
      // console.log(files.length);
      let docPromises: Promise<DocumentData>[] = [];

      files.forEach((file) => {
        if (file.endsWith(".txt")) {
          let id = file.split(".")[0];
          docPromises.push(
            fs.readFile(`${DATA_DIR_TRAIN}/${file}`, "utf8").then((data) => {
              const lines = data.trim().split("\n");
              const title = lines[0];
              const author =
                lines[1] == "�"
                  ? undefined
                  : lines[1].replace("Story by: ", "");
              const date = lines[2].replace("Date Published to Web: ", "");
              const content = lines.slice(3).join("\n");

              return {
                id,
                file,
                title,
                author,
                date,
                content: lines.join("\n"),
              };
            })
          );
        }
      });

      return docPromises;
    })
    .then((docs) => {
      return Promise.all(docs);
    });
}

const DATA_DIR = "./data/dataset1/news-original-and-extra-raw-tables";
const keyEvents = [
  "1101243338500",
  "1101243338500",
  "1101162452451",
  "1101243338500",
  "1101240332919",
  "1101163840166",
  "1101631275108",
  "1101163661840",
  "1101163452222",
  "1101631275108",
  "1101163019147",
  "1101163018599",
  "1101163018612",
  "1101163017765",
  "1101163840166",
  "1101163727099",
  "1101163726024",
  "1101163595600",
  "1101163356500",
  "1101163356001",
  "1101163977242",
  "1101162945890",
  "1101163977242",
  "1101162413930",
];

export function loadDocuments() {
  console.log("Loading documents");

  return fs
    .readdir(DATA_DIR)
    .then((files) => {
      // console.log(files.length);
      let docPromises: Promise<DocumentData>[] = [];

      files.forEach((file) => {
        if (file.endsWith(".txt")) {
          let id = file.split(".")[0];
          if (keyEvents && keyEvents.includes(id)) {
            docPromises.push(
              fs.readFile(`${DATA_DIR}/${file}`, "utf8").then((data) => {
                const lines = data.trim().split("\n");
                const title = lines[0];
                const author =
                  lines[1] == "�"
                    ? undefined
                    : lines[1].replace("Story by: ", "");
                const date = lines[2].replace("Date Published to Web: ", "");
                const content = lines.slice(3).join("\n");

                return {
                  id,
                  file,
                  title,
                  author,
                  date,
                  content: lines.join("\n"),
                };
              })
            );
          }
        }
      });

      return docPromises;
    })
    .then((docs) => {
      return Promise.all(docs);
    });
}

const DATA_DIR2 = "./data/dataset2/News";
// referring to the contextent findings with the Best Debriefing Award http://visualdata.wustl.edu/varepository/VAST%20Challenge%202007/challenges/2007%20Contest/entries/University%20of%20British%20Columbia%20and%20Simon%20Fraser%20Un/
// also referring to the solution
// noted that monkeypox plot (ecoterrorism) is not complete because some of the important events are included in a website not here
const keyEvents2 = [
  // Fish
  "Week-of-Mon-20030526-2.txt_57-replaced",
  "Week-of-Mon-20030630.txt_40-updated",
  "Week-of-Mon-20030922.txt_28",
  "Week-of-Mon-20031027.txt_57-updated",
  "Week-of-Mon-20031027.txt_57-extended",
  "Week-of-Mon-20040105-1.txt_58-updated",
  // Hassan Circus
  "Week-of-Mon-20031013.txt_4-updated",
  "Week-of-Mon-20031215-1.txt_91",
  "Week-of-Mon-20040301.txt_71",
  "Week-of-Mon-20040315.txt_15-updated",
  "Week-of-Mon-20040301-1.txt_75",
  "Week-of-Mon-20040301-1.txt_75-extended",

  // r'Bert Takes a Powder @deprecated
  "Week-of-Mon-20030609.txt_7",
  "Week-of-Mon-20040119-1.txt_98",
  "Week-of-Mon-20040308.txt_109",
  "Week-of-Mon-20040412-2.txt_13",
  "Week-of-Mon-20040614.txt_94",
  "Week-of-Mon-20040628.txt_61", // NOTE: repeated

  // Illegal Chinchilla Smuggling in Chile @deprecated
  "Week-of-Mon-20040216-5.txt_18",

  // monkeypox plot start from here
  "Week-of-Mon-20030518.txt_1-updated",
  // "Week-of-Mon-20030602-1.txt_66", // NOTE: combined with Week-of-Mon-20030609.txt_4-updated
  "Week-of-Mon-20030609.txt_4-updated",
  "Week-of-Mon-20030818-1.txt_44-updated",
  "Week-of-Mon-20030901-1.txt_36-updated",
  "Week-of-Mon-20040705.txt_83-updated",
  // "Week-of-Mon-20040628.txt_61", // NOTE: repeated, delete if not needed
  "Week-of-Mon-20040705.txt_86-updated",
];
function loadDocuments2() {
  console.log("Loading documents 2");

  return fs
    .readdir(DATA_DIR2)
    .then((files) => {
      // console.log(files.length);
      let docPromises: Promise<DocumentData>[] = [];

      files.forEach((file) => {
        if (file.endsWith(".xml")) {
          let id = file.split(".").slice(0, -1).join(".");
          // if (!keyEvents2 || keyEvents2.includes(id)) {
          docPromises.push(
            fs.readFile(`${DATA_DIR2}/${file}`).then((data) => {
              // console.log(file);

              return parser.parseStringPromise(data).then((result) => {
                const content = result.doc.content[0];
                const date = result.doc.date[0];

                return {
                  id,
                  file,
                  title: result.doc.content[0].trim().split("\n")[0].trim(),
                  author: "",
                  date,
                  content: content + "\n\n" + date,
                };
              });
            })
          );
          // }
        }
      });

      return docPromises;
    })
    .then((docs) => {
      return Promise.all(docs);
    });
}

const DATA_DIR3 =
  "./data/dataset3/Stegosaurus Scenario and Data/Alderwood Daily News Articles";
const keyEvents3 = [
  "1101163572132",
  "1101163376276",
  "1101163156775",
  "1101163975356",
  "1101162906435",
  "1101163456898",
  "1101162143775",
  "1101162589891",
  "1101234275352",
  "1101164682719",
  "1101242456221",
  "1101163834618",
  "1101242535666",
  "1101163061865",
  "1101163932216",
  "1101162688110",
  "1101241536631",
];
function loadDocuments3() {
  console.log("Loading documents 3");

  return fs
    .readdir(DATA_DIR3)
    .then((files) => {
      let docPromises: Promise<DocumentData>[] = [];
      // console.log(files.length);

      files.forEach((file) => {
        if (file.endsWith(".txt")) {
          let id = file.split(".")[0];
          if (!keyEvents3 || keyEvents3.includes(id)) {
            docPromises.push(
              fs.readFile(`${DATA_DIR3}/${file}`, "utf8").then((data) => {
                const lines = data.trim().split("\n");
                const title = lines[0];
                const author =
                  lines[1] == "�"
                    ? undefined
                    : lines[1].replace("Story by: ", "");
                const date = lines[2].replace("Date Published to Web: ", "");
                const content = lines.slice(3).join("\n");

                return {
                  id,
                  file,
                  title,
                  author,
                  date,
                  content: lines.join("\n"),
                };
              })
            );
          }
        }
      });

      return docPromises;
    })
    .then((docs) => {
      return Promise.all(docs);
    });
}

const randomDocs2 = [
  "Week-of-Mon-20040614-2.txt_58",
  "Week-of-Mon-20040119-4.txt_7",
  "Week-of-Mon-20040209-5.txt_43",
  "Week-of-Mon-20040322-6.txt_69",
  "Week-of-Mon-20031229-6.txt_79",
  "Week-of-Mon-20040705.txt_81",
  "Week-of-Mon-20040119-4.txt_11",
  "Week-of-Mon-20040119-6.txt_43",
  "Week-of-Mon-20040614.txt_43",
  "Week-of-Mon-20040628-1.txt_28",
  "Week-of-Mon-20040202-4.txt_81",
  "Week-of-Mon-20040614-2.txt_11",
  "Week-of-Mon-20040614-2.txt_86",
  "Week-of-Mon-20040308-4.txt_19",
  "Week-of-Mon-20040216-3.txt_119",
  "Week-of-Mon-20040607-3.txt_52",
  "Week-of-Mon-20031215-3.txt_86",
  "Week-of-Mon-20031006.txt_21",
];

function computeWordCount(docs) {
  let wordCount = 0;
  docs.forEach((doc) => {
    wordCount += doc.content.split(" ").filter(function (n) {
      return n != "";
    }).length;
  });
  return wordCount;
}

export function init() {
  return new Promise<void>((resolve, reject) => {
    Promise.all([
      loadDocumentsTraining(),
      loadDocuments(),
      loadDocuments2(),
      loadDocuments3(),
    ]).then(([docsTrain, docs1, docs2, docs3]) => {
      console.log("Loading documents complete");
      console.log(
        `${docsTrain.length} documents (${computeWordCount(
          docsTrain
        )} words) loaded for dataset training`
      );
      // console.log(`${docs1.length} documents (${computeWordCount(docs1)} words) loaded for dataset 1`);
      // console.log(`${docs2.length} documents (${computeWordCount(docs2)} words) loaded for dataset 2`);
      // console.log(`${docs3.length} documents (${computeWordCount(docs3)} words) loaded for dataset 3`);

      // documents["1"] = docs1;
      // documents["2"] = docs2;
      // documents["3"] = docs3;

      // let half = Math.floor(docs1.length / 2);
      // documents["0"] = docs1.slice(0, half);
      // documents["1"] = docs1.slice(half);

      // half = Math.floor(docs2.length / 2);
      // documents["2"] = docs2.slice(0, half);
      // documents["3"] = docs2.slice(half);

      // half = Math.floor(docs3.length / 2);
      // documents["4"] = docs3.slice(0, half);
      // documents["5"] = docs3.slice(half);

      let subdoc1 = docs2.filter((doc) => {
        return (
          keyEvents2.slice(0, 6).includes(doc.id) ||
          randomDocs2.slice(0, 9).includes(doc.id)
        );
      });
      let subdoc2 = docs2.filter((doc) => {
        return (
          keyEvents2.slice(6, 12).includes(doc.id) ||
          randomDocs2.slice(9).includes(doc.id)
        );
      });
      let subdoc3 = docs2.filter((doc) => {
        return keyEvents2.slice(19).includes(doc.id);
      });
      console.log(
        `${subdoc1.length} documents (${computeWordCount(
          subdoc1
        )} words) loaded for dataset 1`
      );
      console.log(
        `${subdoc2.length} documents (${computeWordCount(
          subdoc2
        )} words) loaded for dataset 2`
      );
      console.log(
        `${subdoc3.length} documents (${computeWordCount(
          subdoc3
        )} words) loaded for dataset 3`
      );

      docsTrain = _.shuffle(docsTrain);
      subdoc1 = _.shuffle(subdoc1);
      subdoc2 = _.shuffle(subdoc2);

      documents["0"] = docsTrain;
      documents["1"] = subdoc1;
      documents["2"] = subdoc2;
      documents["3"] = subdoc3;

      resolve();
    });
  });
}
