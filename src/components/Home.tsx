import * as React from 'react';

interface IHomeProps {
    message: string;
    author: string;
}

export default class Home extends React.Component<IHomeProps, {}> {
    public render(): JSX.Element {
        return (
            <div>
                {this.props.message} by {this.props.author}
            </div>
        );
    }
}
