import { useState, useEffect } from "react";

const SearchBar = ({
    filterByObj,
    setFilterByObj,
    fetchData,
    placeholder,
    height
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);


    useEffect(() => {
        setFilterByObj({
            ...filterByObj,
            search: debouncedTerm,
        });
    }, [debouncedTerm]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);

        // Cleanup previous timeout
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]); // Runs when searchTerm changes

    useEffect(() => {
        if (filterByObj.from) {
            fetchData()
        }
        fetchData()
    }, [filterByObj])

    return <div className="form-wrap icon-form">
        <span className="form-icon"><i className="ti ti-search" /></span>
        <input type="text" className="form-control" placeholder={placeholder} style={{ height:  height  }}
            onChange={(e) => {
                setSearchTerm(e.target.value);
            }}
        />
    </div>
}

export default SearchBar