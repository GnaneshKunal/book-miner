import axios from 'axios';
import * as AxiosTypes from 'axios';
import * as cheerio from 'cheerio';
import * as Entities from 'html-entities';
import * as fs from 'fs';

const AllHtmlEntities = Entities.AllHtmlEntities;

interface IBookReview {
    Title: String;
    Year: String;
    Rating: String;
    Review: String;
    Reviewer: String;
}


// console.log(AllHtmlEntities.decode('&lt;&gt;&quot;&amp;&copy;&reg;'));

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

// #freeTextContainer16229583079382358220
function request(/* link: String */) : void | never {
    axios.get('https://www.goodreads.com/book/show/26233572')
        .then((response: AxiosTypes.AxiosResponse) => {
            const html: any = response.data;
            // const $: CheerioStatic = cheerio.load(html);
            // const country: Cheerio = $('#titleDetails.article div.txt-block').first().find('a');
            // const html: any = data.toString();
            const $: CheerioStatic = cheerio.load(html);
            // const review: Cheerio = $('#review_829021593 > div:nth-child(3) > div:nth-child(2)');
            const bookMeta: Cheerio = $('#bookMeta');
            const counts = bookMeta.find('a').next().next().next()
            const title = bookMeta.find('span')
            const rating: Cheerio = bookMeta.find('span').next().next();
            const ratingsCount: Cheerio = counts.find('span')
            const reviewsCount: Cheerio = counts.next().next().find('span')
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
                `ReviewerName: ${reviewerRatings}`
            )
        })
        .catch(error => {
            console.log(error.response);
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

request();