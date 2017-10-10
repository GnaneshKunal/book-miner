import axios from 'axios';
import * as AxiosTypes from 'axios';
import * as cheerio from 'cheerio';
import * as Entities from 'html-entities';
import * as _ from 'lodash';
//import * as fs from 'fs';
import * as mongoose from 'mongoose';
import * as redis from 'redis';
import * as bluebird from 'bluebird';
import * as es6Promise from 'es6-promise';
import BookReview from '../lib/model';

const AllHtmlEntities: any = Entities.AllHtmlEntities;

interface IBookReview {
    Title: String;
    Year: String;
    Rating: String;
    Review: String;
    Reviewer: String;
}

let url: string = 'mongodb://monster:monster@localhost:27017/book-miner';

mongoose.connect(url, {
    useMongoClient: true
}, (err: mongoose.Error) => {
    if (err) {
        console.log(err.message);
        console.log(err);
    } else {
        console.log('Connected to MongoDb')
    }
});

global.Promise = es6Promise.Promise;
(<any>mongoose).Promise = global.Promise;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient();

function decodeText<Any>(text: String): String {
    let textTemp = text;
    textTemp = stripHTMLTags(textTemp);
    textTemp = decodeHTMLChars(textTemp);
    return textTemp;
}

function stripHTMLTags(text: String): String {
    return text.replace(/<[^>]*>/g, '').replace('\n ', '').replace('\n', '')
}

function decodeHTMLChars(text: String): String {
    return AllHtmlEntities.decode(text);
}

function CheerioHTMLtoString(elem: Cheerio) {
    return decodeText(elem.html().trim())
}

// #freeTextContainer16229583079382358220

let time = false;
function request(num: Number) : void | never {
    let n = 5107;
    axios.get(`https://www.goodreads.com/book/show/${num}`)
        .then((response: AxiosTypes.AxiosResponse) => {
            const html: any = response.data;
            // const $: CheerioStatic = cheerio.load(html);
            // const country: Cheerio = $('#titleDetails.article div.txt-block').first().find('a');
            // const html: any = data.toString();
            const $: CheerioStatic = cheerio.load(html);
            // const review: Cheerio = $('#review_829021593 > div:nth-child(3) > div:nth-child(2)');
            const bookMeta: Cheerio = $('#bookMeta');
            const counts = bookMeta.find('a').next().next().next();
            const title = bookMeta.find('span');
            const author = $('#bookAuthors').find('.authorName');
            const rating: Cheerio = bookMeta.find('span').next().next();
            const ratingsCount: Cheerio = counts.find('span');
            const reviewsCount: Cheerio = counts.next().next().find('span');
            // var counts = bookMeta.find('a').next().next().next();
            // var averageReview = bookMeta.find('span').next().next()
            // var ratingsCount = counts.find('span');
            // var reviewsCount = counts.next().next().find('span');
            // const reviewText = decodeText(review.html())
            // console.log(decodeText(reviewsCount.html().trim()))

            //Author:
            
            const reviewer = $('#bookReviews > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
            const reviewerName = reviewer.find('div.reviewHeader').find('span')
            const reviewerRatings = reviewer.find('div.reviewHeader').find('span').next().length //change this
            const review: Cheerio = reviewer.find('div.reviewText').find('span').next()
            console.log(
                `Title: ${decodeText(title.html().trim())}\n
                Rating: ${decodeText(rating.html().trim())}\n
                Ratings Count: ${decodeText(ratingsCount.html().trim())}\n
                Reviews Count: ${decodeText(reviewsCount.html().trim())}`
            )
            console.log(
                `ReviewerName: ${decodeText(author.html().trim())}`
            )

            let bookReview = new BookReview({
                title: CheerioHTMLtoString(title),
                author: CheerioHTMLtoString(author),
                rating: Number(CheerioHTMLtoString(rating)),
                ratingsCount: Number(CheerioHTMLtoString(ratingsCount).replace(/,/g, '')),
                reviewsCount: Number(CheerioHTMLtoString(reviewsCount).replace(/,/g, '')),
                bookID: num,
                reviewerName: CheerioHTMLtoString(reviewerName),
                review: CheerioHTMLtoString(review)
            });
            bookReview.save((err: mongoose.Error) => {
                if (err) {
                    console.log(err.message);
                    console.log(err);
                } else {
                    console.log(num);
                }
            });

            // title: String;
            // author: String;
            // rating: Number;
            // ratingsCount: Number;
            // reviewsCount: Number;
        
            // reviewerName: String;
            // review: String;
            time = false;

        })
        .catch(error => {
            // console.log(error.response);
            if (error) { }
            console.log('cant do ');
            time = true;
        })

    // #review_1948610567 > div:nth-child(3) > div:nth-child(2)
    // #review_1837364110 > div:nth-child(3) > div:nth-child(2)
    // .firstReview
    // fs.readFile('/home/monster/git/book-miner/dist/crawler/harry.html', (err, data) => {
    //     if (err) {
    //         throw err;
    //     }
    //     const html: any = data.toString();
    //     const $: CheerioStatic = cheerio.load(html);
    //     const title: Cheerio = $('#bookTitle').first();
    //     const author: Cheerio = $('#bookAuthors > span:nth-child(2) > a:nth-child(1) > span:nth-child(1)');
    //     const rating: Cheerio = $('.average');
    //     const review: Cheerio = $('#freeText16229583079382358220');
    //             // console.log(author.html());
    //             // author.html()
    //             console.log(`Book Title: ${title.html()}\n
    //             Author: ${author.html()}\n
    //             Rating: ${rating.html()}\n
    //             review: ${
    //                 decodeText(review.html())
    //             }\n`);
    // });
    // fs.readFile('/home/monster/git/book-miner/dist/crawler/harry.html', (err, data) => {
    //     const html: any = data.toString();
    //     const $: CheerioStatic = cheerio.load(html);
    //     const review: Cheerio = $('#review_829021593 > div:nth-child(3) > div:nth-child(2)');
    //     const review2: Cheerio = $('#bookReviews > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').find('div.reviewText').find('span').next()
    //     console.log(review2.html())
    // });
}

function request2(cb: Function) : void | never {
    var arr: Array<String> = [];
    axios.get(`https://www.goodreads.com/book/show/18114322-the-grapes-of-wrath`)
        .then((response: AxiosTypes.AxiosResponse) => {
            const html: any = response.data;
            const $: CheerioStatic = cheerio.load(html);
            var links = $("a");
            links.each(function(this: Cheerio) {
                let that: any = this;
                let link2 = $(that).attr('href');
                let link;
                if (link2 !== undefined) {
                    link = link2.match(/www.goodreads.com\/book\/show\/(\d+)\..*/g);
                }
                if (link !== null  && link !== undefined && link.length === 1) {
                    arr.push(link[0]);
                }
            });
            cb(arr);
        })
        .catch(error => {
            throw error;
        })
}

// request2((arr: Array<string>) => {
//     let arr4 = arr.map(x => x.split(/www.goodreads.com\/book\/show\//).filter(x => x !== ''))
//     let arr5 = _.flatMap(arr4)
//     let arr6 = _.map(arr5, (x) => {
//         let y = x.split('.')
//         let y1 = y[0]
//         let y2 = y[1].toLocaleLowerCase()
//         let z = {y1 , y2}
//         return z;
//     });

//     // let links = await redisClient.spop("links");
//     // console.log(links);

//     type TupIdName = {y1: String, y2: String }

//     let arr7: any = _.orderBy(arr6, (x => x.y2));
//     let finalArray = arr7.filter((e: TupIdName, i: TupIdName) => arr7.findIndex((e2: TupIdName) => e.y2 === e2.y2) === i)
//     console.log(finalArray.map((x: TupIdName) => x.y1 + "." + x.y2))
// });

type reduceCB = (arr2: Array<String>) => void;

function reduceArray(arr: Array<String>, cb: reduceCB): void  {
    let arr4 = arr.map(x => x.split(/www.goodreads.com\/book\/show\//).filter(x => x !== ''))
    let arr5 = _.flatMap(arr4)
    let arr6 = _.map(arr5, (x) => {
        let y = x.split('.')
        let y1 = y[0]
        let y2 = y[1].toLocaleLowerCase()
        let z = {y1 , y2}
        return z;
    });

    type TupIdName = {y1: String, y2: String }

    let arr7: any = _.orderBy(arr6, (x => x.y2));
    let finalArray = arr7.filter((e: TupIdName, i: TupIdName) => arr7.findIndex((e2: TupIdName) => e.y2 === e2.y2) === i);
    let arr8 =  finalArray.map((x: TupIdName) => x.y1 + "." + x.y2);
    cb(arr8);
}


async function getLink() {
    let link;

    try {
        link = await (<any>redisClient).spopAsync('links')
    } catch (err) {
        throw err;
    }
    console.log("Link + " + link);

    return link;
}

async function checkForExistence(num: Number) {
    return await (<any>redisClient).sismemberAsync("donelinks", num.toString());
}

async function doTask(cb: Function) {
    
    let linkURI = await getLink();

    // Need logic here
    if (linkURI === null) {
        console.log("Link Null Exiting: " + linkURI);
        return;
    }
    let num = linkURI.match(/(\d+)/)[0];
    //check for existence
    let existence = await checkForExistence(num);
    if (existence) {
        console.log('Grabed link already');
        doTask(cb);
    }
    let arr: Array<String> = [];
    axios.get(`https://www.goodreads.com/book/show/${linkURI}`)
        .then((response: AxiosTypes.AxiosResponse) => {
            const html: any = response.data;
            const $: CheerioStatic = cheerio.load(html);
            const bookMeta: Cheerio = $('#bookMeta');
            const counts = bookMeta.find('a').next().next().next();
            const title = bookMeta.find('span');
            const author = $('#bookAuthors').find('.authorName');
            const rating: Cheerio = bookMeta.find('span').next().next();
            const ratingsCount: Cheerio = counts.find('span');
            const reviewsCount: Cheerio = counts.next().next().find('span');
            let links = $("a");
            links.each(function(this: Cheerio) {
                let that: any = this;
                let link2 = $(that).attr('href');
                let link;
                if (link2 !== undefined) {
                    link = link2.match(/www.goodreads.com\/book\/show\/(\d+)\..*/g);
                }
                if (link !== null  && link !== undefined && link.length === 1) {
                    arr.push(link[0]);
                }
            });
            const reviewer = $('#bookReviews > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
            const reviewerName = reviewer.find('div.reviewHeader').find('span')
            const reviewerRatings = reviewer.find('div.reviewHeader').find('span').next().length //change this
            const review: Cheerio = reviewer.find('div.reviewText').find('span').next()
            let bookReview = new BookReview({
                title: CheerioHTMLtoString(title),
                author: CheerioHTMLtoString(author),
                rating: Number(CheerioHTMLtoString(rating)),
                ratingsCount: Number(CheerioHTMLtoString(ratingsCount).replace(/,/g, '')),
                reviewsCount: Number(CheerioHTMLtoString(reviewsCount).replace(/,/g, '')),
                bookID: num,
                reviewerName: CheerioHTMLtoString(reviewerName),
                review: CheerioHTMLtoString(review)
            });
            bookReview.save((err: mongoose.Error) => {
                if (err) {
                    console.log("MongoMessage " + err.message);
                    console.log("MongoError " + err);
                } else {
                    console.log("Done ID: " + num);
                    redisClient.sadd('donelinks', num);
                }
            });
            cb(arr);
        })
        .catch(error => {
            throw error;
        });
        // doTask(cb);
}

doTask((arr: Array<String>) => reduceArray(arr, (arr) => {
    let finalArr = arr;
    finalArr.unshift('links')
    console.log(finalArr);
    redisClient.sadd(finalArr);
}));