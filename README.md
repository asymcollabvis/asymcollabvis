# Code and Data Repository for "Towards an Understanding of Distributed Asymmetric Collaborative Visualization on Problem-solving"


## System
### Backend Proxy for bridging HTTP/2 and HTTP/1

1. Install docker
2. Pull envoy proxy image: `docker pull envoyproxy/envoy:v1.14-latest`
3. `npm install`
4. Run `npm run start:proxy` (For Window machine, you need to change the command in the start.sh into Window format: `docker run --name=proxy -d --platform linux/amd64 -v PATHTOTHEROOTFOLDER/proxy/envoy.yaml:/etc/envoy/envoy.yaml:ro -v PATHTOTHEROOTFOLDER/proxy/cert.pem:/etc/server.crt:ro -v PATHTOTHEROOTFOLDER/proxy/key.pem:/etc/server.key:ro -p 8081:8081 envoyproxy/envoy:v1.14-latest`)

### Envrionment Setting
1. Create a `.env` file under `IAWeb` folder
2. Check the IP of the computer
3. Write `SERVER_URL="https://localhost:8081"` or `SERVER_URL="https://YOURIP:8081"` to the created file

### How to run? (Docker)

1. `cd IAWeb`
2. `docker build . -t asymcollab/app`
3. `docker run --name=asymcollabapp -d -p 1234:1234 -p 9091:9091 -d asymcollab/app`

### How to run? (Native)
#### Backend

1. Open a terminal from the root folder of this repo and `cd IAWeb`
1. `cd server`
1. `npm install`
1. `npm run start:build` (or run `npm run start` if no need to build)

#### Frontend

1. Open a terminal from the root folder of this repo and `cd IAWeb`
2. `npm install`
3. `npm run start`

### Demo (localhost)

1. Go to <https://localhost:8081/> (type “thisisunsafe” if it said it is not safe)
2. Go to <https://localhost:1234/> (type “thisisunsafe” if it said it is not safe)

### Demo (with IP)

1. Go to <https://YOURIP:8081/> (type “thisisunsafe” if it said it is not safe)
2. Go to <https://YOURIP:1234/> (type “thisisunsafe” if it said it is not safe)

### Build Proto rule (if necessary)

After updating Proto rule in `proto`, we need to rebuild using the following commands:

1. `npm run build` (`npm run build:win` if Window machine)


## Data
Here is the stucture of the data folder:
```
/data                               contains all study data
/data/study1                        contains all results in study 1
/data/study1/be.csv                 contains the behaviors engagement rating
/data/study1/ranking.csv            contains the ranking of preference among all conditions
/data/study1/tl.csv                 contains the task load rating
/data/study2                        contains all results in study 2
/data/study2/log_study2_clean.csv   contains all the interaction logs in study 2 (the data of G2 and G3 is missing, label G11 is presented as G1 in the paper)
/data/study2/combined.csv           contains the combined data of behaviors engagement rating, ranking of preference, task load, and coded result of the communcation logs
```

## Roadmap
- [ ] Clean the repo by removing unused code
- [ ] Support documents upload
- [ ] Support user experience replay for research analysis
- [ ] More features

## Citing the project
```
@article{tong2023towards,
  title={Towards an Understanding of Distributed Asymmetric Collaborative Visualization on Problem-solving},
  author={Tong, Wai and Xia, Meng and Wong, Kam Kwai and Bowman, Doug A and Pong, Ting-Chuen and Qu, Huamin and Yang, Yalong},
  journal={arXiv preprint arXiv:2302.01966},
  year={2023}
}
```
