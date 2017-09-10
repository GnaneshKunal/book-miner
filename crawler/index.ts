import * as cheerio from 'cheerio';
import * as superagent from 'superagent';

interface IReview {
    Title: string;
    Rating: string;
    Story: string;
}

function request(link: string): void | never {
    superagent.get(link, (err: Error, res: superagent.Response): never | void => {
    if (err) {
        throw err;
    }
    const html: any = res.text;
    const $: CheerioStatic = cheerio.load(html);
    const country: Cheerio = $('#titleDetails.article div.txt-block').first().find('a');
    if (country.html() === 'India') {
        const review = $('#titleUserReviewsTeaser.article div.user-comments');
        const reviewTitle: string =  $('#titleUserReviewsTeaser.article div.user-comments span strong').text();
        const reviewRating: string = review.children('.tinystarbar').attr('title');
        const reviewStory: string = $('#titleUserReviewsTeaser.article div.user-comments span div p').text();
        const MovieRating: IReview = {
            Title: reviewTitle,
            Rating: reviewRating,
            Story: reviewStory
        }; // tslint:disable-next-line
        console.log(MovieRating);
    } else { // tslint:disable-next-line
        console.log('Sorry, I do accept only Indian films.');
    }
});
}
