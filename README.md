
# URL-shortner

URL shortening is used to create shorter aliases for long URLs. We call these shortened
aliases “short links.” Users are redirected to the original URL when they hit these short
links. Short links save a lot of space when displayed, printed, messaged, or tweeted.
Additionally, users are less likely to mistype shorter URLs.
For example, if we shorten the following URL through TinyURL:
https://babeljs.io/blog/2020/10/15/7.12.0#class-static-blocks-
12079httpsgithubcombabelbabelpull12079-12143httpsgithubcombabelbabelpull12143

## 


## Requirements



```bash
  - node ^20.0.0
  - docker (redis image)
  - mongo db cluster 
  - OAuth credential for nodemailer
```
Create a .env file using .env.example as reference
## Run Locally

Clone the project

```bash
  git clone https://github.com/Ultimate-conscious/UrlShortner.git
```

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Important Prequisites

```bash
  - Run a redis docker image on port 6379
  - Fill .env with your credentials
```

Start the server

```bash
  npm run start
```

