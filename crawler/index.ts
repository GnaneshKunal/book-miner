import axios from 'axios';
import * as AxiosTypes from 'axios';
import * as cheerio from 'cheerio';
import * as Entities from 'html-entities';
//import * as fs from 'fs';
import * as mongoose from 'mongoose';
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

(<any>mongoose).Promise = global.Promise;

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


        })
        .catch(error => {
            console.log(error.response);
            console.log('cant do ');
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
let i = 0;
// request();
while (i < 10000) {
    i++;
    setTimeout(() => {
        request(i);
    }, 500)
}

// setInterval(() => {
    
// }, 500);