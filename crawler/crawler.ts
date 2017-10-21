
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
var Crawler = require("js-crawler");
import * as yargs from 'yargs';

let argv = yargs.argv;

import BookReview from '../lib/model';


var crawler = new Crawler().configure({ignoreRelative: false, depth: 10});

const AllHtmlEntities: any = Entities.AllHtmlEntities;

let url: string = 'mongodb://monster1:monster@localhost:27017/book-miner';

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
    let text = '';
    try {
            if (elem.html() == null) {
            return '';
        }
        return decodeText(elem.html().trim())
    } 
    catch(err) {
        return text;
    }
}

// #freeTextContainer16229583079382358220
type reduceCB = (arr2: Array<String>) => void;

function reduceArray(arr: Array<String>, cb: reduceCB): void  {
    let arr4 = arr.map(x => x.split(/www.goodreads.com\/book\/show\//).filter(x => x !== ''));
    let arr5 = _.flatMap(arr4);
    // let arr2 = arr5.map(x => x.split('?')[0])
    let arr6 = _.map(arr5, (x) => {
        let y = x.split('.');
        let y1 = y[0];
        let y2 = y[1].toLocaleLowerCase();
        let z = {y1 , y2};
        return z;
    });

    type TupIdName = { y1: String, y2: String }

    let arr7: any = _.orderBy(arr6, (x => x.y2));
    let finalArray = arr7.filter((e: TupIdName, i: TupIdName) => arr7.findIndex((e2: TupIdName) => e.y2 === e2.y2) === i);
    let arr7_8 = finalArray.filter((e: TupIdName, i: TupIdName) => finalArray.findIndex((e2: TupIdName) => e.y1 === e2.y1) === i);
    let finalArray2 = arr7_8.map((x: TupIdName) => {
        return {
            'y1': x.y1,
            'y2': x.y2.split('?')[0]
        }
    });
    let arr8 =  finalArray2.map((x: TupIdName) => x.y1 + "." + x.y2);
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
    
    let response;

    try {
        response = await axios.get(`https://www.goodreads.com/book/show/${linkURI}`);
    }
    catch(err) {
        throw err;
    }

}

for (var i = parseInt(argv.min); i <= parseInt(argv.max); i++) {
    // if (!_.includes(arrm, i))
    crawler.crawl({
  url: "https://www.goodreads.com/book/show/" + i,
  success: function(page: any) {
    if (page.url.match(/www.goodreads.com\/book\/show/)) {
    const html: any = page.content;
    const $: CheerioStatic = cheerio.load(html);
    const bookMeta: Cheerio = $('#bookMeta');
    const counts = bookMeta.find('a').next().next().next();
    const title = bookMeta.find('span');
    const author = $('#bookAuthors').find('.authorName');
    const rating: Cheerio = bookMeta.find('span').next().next();
    const ratingsCount: Cheerio = counts.find('span');
    const reviewsCount: Cheerio = counts.next().next().find('span');
    let links = $("a");
    let num = page.url.match(/\/(\d+)/)[1]
    const reviewer = $('#bookReviews > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')
    const reviewerName = reviewer.find('div.reviewHeader').find('span')
    let reviewerRatings;
    let reviewerRatings2;
    try {
        reviewerRatings = reviewer.find('div.reviewHeader').find('span').next().find('span').text();
        switch(reviewerRatings) {
            case "it was amazing":
                reviewerRatings2 = 5;
                break;
            case "really liked it":
                reviewerRatings2 = 4;
                break;
            case "liked it":
                reviewerRatings2 = 3;
                break;
            case "it was okay":
                reviewerRatings2 = 2;
                break;
            case "did not like it":
                reviewerRatings2 = 1;
                break;

            default:
                reviewerRatings2 = null;
        }
    }
    catch(err) {
        reviewerRatings2 = null;
    }
    const review: Cheerio = reviewer.find('div.reviewText').find('span').next()
    let bookReview = new BookReview({
        title: CheerioHTMLtoString(title),
        author: CheerioHTMLtoString(author),
        rating: Number(CheerioHTMLtoString(rating)),
        ratingsCount: Number(CheerioHTMLtoString(ratingsCount).replace(/,/g, '')),
        reviewsCount: Number(CheerioHTMLtoString(reviewsCount).replace(/,/g, '')),
        bookID: num,
        reviewerName: CheerioHTMLtoString(reviewerName),
        review: CheerioHTMLtoString(review),
        reviewerRatings: reviewerRatings2
    });
    bookReview.save((err: mongoose.Error) => {
        if (err) {
            console.log(err);
            console.log('Error ID: ' + num);
        } else {
            console.log("Done ID: " + num);
            // redisClient.sadd('donelinks', num);
        }
    });
    }
  },
  failure: function(page: any) {
    console.log(page.status);
  },
  finished: function(crawledUrls: any) {
    console.log(crawledUrls);
  }
});
}