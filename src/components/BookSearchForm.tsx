import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from '../actions';

interface IBookSearchState {
    search: string
}

interface IBookSchema {
    author: string
    bookID: Number
    rating: Number
    title: string
}

interface IBookSearchProps {
    getBooks: Function,
    search: any,
    data: any
}

class BookSearchFrom extends React.Component<IBookSearchProps, IBookSearchState> {

    constructor(props: any) {
        super(props);

        this.state = {
            search: ''
        }

    }

    onFormSubmit (event: any) {
        event.preventDefault();
        
        if (this.state.search.trim() !== '') {
            this.props.getBooks({
                search: this.state.search
            });

            this.setState({
                search: ''
            });   
        }
    }

    async onChangeSearchHandler(event: any) {
        await this.setState({ search: event.target.value });
        if (this.state.search.trim() !== '') {
            this.props.getBooks({
                search: this.state.search
            });
        }
    }

    renderBooks(data: any) {
        if (data !== undefined && data !== null) {
            return (
                <div className="list-group">
                    {data.map((x: IBookSchema) => {
                        return (
                            <Link to={`/book/${x.bookID}`} className="list-group-item list-group-item-action flex-column align-items-start">
                                <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{x.title}</h5>
                                <small>{x.rating}</small>
                                </div>
                                <p className="mb-1">{x.author}</p>
                                <small>{x.bookID}</small>
                            </Link>
                        );
                    })}
                </div>
            );
        } else {
            return (
                <div>
                </div>
            )
        }
    }

    renderForm(): JSX.Element {
        return (
            <div className="container" style={{"margin-left": "30%", "margin-top": "20%"}}>
                <div className="row clearfix">
                    <div className="col-md-12 column">
                        <div className="col-md-6 col-md-offset-3 column">
                            <form role="form" onSubmit={this.onFormSubmit.bind(this)}>
                                <div className="form-group">
                                    <label className="h1" style={{"padding-left": "30%"}}>Search Book</label>
                                    <input type="text" 
                                        name="search" className="form-control text-center"
                                        value={this.state.search}
                                        placeholder="Search Book"
                                        onChange={event => {
                                            this.onChangeSearchHandler(event);
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="col-md-6 text-center"> 
                                        <button id="singlebutton" style={{"padding": "10px 92% 10px 92% ", "text-align": "center"}} className="btn btn-primary">Search</button> 
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-6 col-md-offset-3 column">
                            {this.renderBooks(this.props.search.data)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.renderForm()}
            </div>
        );
    }

}

const mapStateToProps = (state: any) => state;

export function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        getBooks: (search: { search: string }) => dispatch<any>(actions.getBooks(search))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookSearchFrom);