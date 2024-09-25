const loadData = async (url) => {
    const request = await fetch(url); 
    const response = await request.json(); 
    return response;
};

loadData('data.json').then(data => {
    if (data) {
        console.log(data); 
    } else {
        console.log("No data returned");
    }
});
