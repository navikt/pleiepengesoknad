import * as React from 'react';
import Fetcher2 from '../Fetcher2';
import Fetcher from '../Fetcher';
import Fetcher3 from '../Fetcher3';
import { myFetcherRecipe, MyFetcherType } from './exampleType';

const ExampleView: React.FC = () => {
    return (
        <div>
            {/* Fetch 1 resource */}
            <Fetcher<MyFetcherType>
                recipies={[myFetcherRecipe]}
                loading={() => <div>Is loading...</div>}
                error={(e: Error) => <div>Oops something went wrong. Handle the error here</div>}
                success={([myFetcherType]: [MyFetcherType]) => (
                    <div>Successfully got the data. Use it in this view.</div>
                )}
            />
            {/* Fetch 2 resources */}
            <Fetcher2<MyFetcherType, MyFetcherType>
                recipies={[myFetcherRecipe, myFetcherRecipe]}
                loading={() => <div>Is loading...</div>}
                error={(e: Error) => <div>Oops something went wrong. Handle the error here</div>}
                success={([myFetcherType1, myFetcherType2]: [MyFetcherType, MyFetcherType]) => (
                    <div>Successfully got the data. Use it in this view.</div>
                )}
            />
            {/* Fetch 3 resources */}
            <Fetcher3<MyFetcherType, MyFetcherType, MyFetcherType>
                recipies={[myFetcherRecipe, myFetcherRecipe, myFetcherRecipe]}
                loading={() => <div>Is loading...</div>}
                error={(e: Error) => <div>Oops something went wrong. Handle the error here</div>}
                success={([myFetcherType1, myFetcherType2, myFetcherType3]: [
                    MyFetcherType,
                    MyFetcherType,
                    MyFetcherType
                ]) => <div>Successfully got the data. Use it in this view.</div>}
            />
            <div>-----------------------------</div>
        </div>
    );
};

export default ExampleView;
