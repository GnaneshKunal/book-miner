import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import * as actions from '../actions';

interface IBookViewProps {
    book: {
        data: any
    }
    getBook: (bookID: number) => any,
    match: {
        params: {
            id: number
        }
    }
}

class BookView extends React.Component<IBookViewProps, {}> {

    constructor(props: any) {
        super(props);
        this.props.getBook(this.props.match.params.id);

    }

    template(elem: JSX.Element): JSX.Element {
        return (
            <div className="container" style={{"margin-left": "30%", "margin-top": "20%"}}>
                    <div className="row clearfix">
                        <div className="col-md-12 column">
                            <div className="col-md-6 col-md-offset-3 column">
                                {elem}
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

    showBook(): JSX.Element {

        let book = this.props.book.data
        
        if (book !== undefined && book !== null)
            return (
                this.template(
                    <div className="card text-center">
                        <div className="card-body">
                            <h4 className="card-title">{book.title}</h4>
                            <p className="card-text">Author: {book.author}</p>
                            <p className="card-text">ratings: {book.ratings}</p>
                            <p className="card-text">Total Ratings: {book.ratingsCount}</p>
                            <p className="card-text">Total Reviews: {book.reviewsCount}</p>
                            <p className="card-text">Reviewer: {book.reviewerName}</p>
                            <p className="card-text">Reviewer Rating: {book.reviewerRatings}</p>
                        </div>
                        <div className="card-footer text-muted">
                            {book.review}
                        </div>
                    </div>
                )
            )
        else
            return (
                this.template(
                    <div>
                        Loading
                    </div>
                )
            )
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.showBook()}
            </div>
        );
    }

}

const mapStateToProps = (state: any) => state;

export function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        getBook: (bookID: number) => dispatch<any>(actions.getBook(bookID))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookView);