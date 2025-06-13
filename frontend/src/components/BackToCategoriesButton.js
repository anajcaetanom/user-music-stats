export const BackToCategoriesButton = ({setShowResults, setCharts}) => {
    const backToCategories = () => {
        setShowResults(false);
        setCharts([]);
    };

    return (
        <div className="center">
            <button onClick={backToCategories}>
                Pick another category
            </button>
        </div>
    )
}