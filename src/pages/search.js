import { useState, useMemo, useCallback, useEffect } from 'react';
import { debounce } from 'lodash'; // You need to install lodash and import debounce
import reviewData from '@/data/review_data.json';
import guideData from '@/data/sc_data.json';
import review from "@/components/Review";
import Layout from "@/components/Layout"
import ContentCard from "@/components/ContentCard";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const data = useMemo(() => reviewData.posts.concat(guideData.posts), []);

    const handleSearch = useCallback(
        term => {
            // Filter the data based on the search term
            const results = data.filter(
                item =>
                    item.title.toLowerCase().includes(term.toLowerCase()) ||
                    item.content.toLowerCase().includes(term.toLowerCase())
            );

            setSearchResults(results);
        },
        [data]
    );

    const debouncedHandleSearch = useMemo(
        () => debounce(handleSearch, 300), // 300ms debounce time
        [handleSearch]
    );

    useEffect(() => {
        debouncedHandleSearch(searchTerm);
    }, [searchTerm, debouncedHandleSearch]);

    const handleChange = e => {
        const term = e.target.value;
        setSearchTerm(term);
    };

    return (
        <Layout>
            <div className="bg-base-100 text-base-content grid grid-cols-1 px-4 py-2">
                <h1 className="text-xl text-center">Search</h1>
                <input className="input-lg" type="text" value={searchTerm} onChange={handleChange} placeholder="Search..." />

                {searchResults.length > 0  && searchTerm.length > 0 ? (
                    <ul className={"grid gap-4 px-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
                        {searchResults.slice(0,100).map(item => (
                            <li className="card" key={item.id}>
                                <ContentCard content={item} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-md py-2">Uh-oh, no results found. Try Again!</p>
                )}
            </div>
        </Layout>
    );
}
