document.addEventListener("DOMContentLoaded",function()
{
    const searchBtn= document.getElementById('search-btn');
    const userInput=document.getElementById('user-input');
    const statsContainer=document.querySelector('.stats-container');
    const easyProgress=document.querySelector('.easy-progress');
    const mediumProgress=document.querySelector('.medium-progress');
    const hardProgress=document.querySelector('.hard-progress');
    const easyLabel=document.getElementById('easy-label');
    const mediumLabel=document.getElementById('medium-label');
    const hardLabel=document.getElementById('hard-label')
    const statsCardContainer=document.querySelector('.stats-card')

// return true or false based on regex
    function validateUserName(userName)
    {
        if(userName.trim()=="")
        {
            alert("userName should not be empty");
            return false;
        }
        const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(userName);
        if(!isMatching)
        {
            alert("Invalid userName ")
        }
        return isMatching;
    }
    async function fetchUserDetails(userName)
    {
        const url=`https://leetcode-stats-api.herokuapp.com/${userName}`
        try{
            searchBtn.textContent="Searching..."
            searchBtn.disabled=true;
            const response=await fetch(url);
            if(!response.ok)
            {
                throw new Error("Unable to fetch the User details");
            }
            const data=await response.json();
            console.log("Logging data:", data);
            displayData(data);
        }
        catch(error){
            statsContainer.innerHTML='<p>No Data Found</p>'
        }
        finally{
            searchBtn.textContent="Search"
            searchBtn.disabled=false;
        }
    }
    function updateProgress(solved,total,label,circle)
    {
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`)
        label.textContent=`${solved}/${total}`;
    }
    function displayData(data)
    {
        const totalQues=data.totalQuestions;

        const totalEasyQues=data.totalEasy;
        const totalMediumQues=data.totalMedium;
        const totalHardQues=data.totalHard;

        const solvedQues=data.totalSolved;

        const easySolvedQues= data.easySolved;
        const mediumSolvedQues=data.mediumSolved;
        const hardSolvedQues=data.hardSolved;
        
        updateProgress(easySolvedQues, totalEasyQues,easyLabel,easyProgress);
        updateProgress(mediumSolvedQues, totalMediumQues,mediumLabel,mediumProgress);
        updateProgress(hardSolvedQues, totalHardQues,hardLabel,hardProgress);

        const cardsData=[
            {label:"Overall Acceptance rate", value:data.acceptanceRate},
            {label:"Overall Ranking", value:data.ranking},
            {label:"Total Question Solved", value:data.totalSolved},
            {label:"Overall Contribution Points", value:data.contributionPoints}

        ]
        console.log("Card Data:",cardsData);

        statsCardContainer.innerHTML=cardsData.map(
            data=>
                `
                <div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
                </div>
                `
        ).join("")
        
        

    }
    searchBtn.addEventListener('click',function()
{
    const userName=userInput.value;
    console.log("Logging UserName", userName);
    if(validateUserName(userName))
    {
        fetchUserDetails(userName);
    }
    
})

})