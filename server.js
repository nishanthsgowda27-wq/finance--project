const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let users = [];

// LOGIN
app.post('/api/login',(req,res)=>{
    let u=users.find(x=>x.account==req.body.account && x.password==req.body.password);
    res.json({success:!!u});
});

// REGISTER
app.post('/api/register',(req,res)=>{
    users.push(req.body);
    res.json({msg:"Registered"});
});

// TAX
app.post('/api/tax',(req,res)=>{
    let i=Number(req.body.income||0);
    let tax=i<=250000?0:i<=500000?(i-250000)*0.05:i<=1000000?12500+(i-500000)*0.2:112500+(i-1000000)*0.3;
    res.json({tax,monthly:Math.round(tax/12)});
});

// LOAN (JOB BASED)
app.post('/api/loan',(req,res)=>{
    let income=Number(req.body.income||0);
    let job=req.body.job;

    let type="", schemes=[];

    if(job==="farmer"){
        type="Agriculture Loan";
        schemes=["KCC", "Crop Loan"];
    }
    else if(job==="business"){
        type="Business Loan";
        schemes=["MSME Loan", "Startup Loan"];
    }
    else{
        type="Govt Employee Loan";
        schemes=["Home Loan","Car Loan","Personal Loan"];
    }

    let eligible=income*20;

    res.json({
        type,
        schemes,
        eligible,
        emi:Math.round(eligible/60)
    });
});

// FD
app.post('/api/fd',(req,res)=>{
    let income=Number(req.body.income||0);
    let amount=Number(req.body.amount||0);
    let rate=Number(req.body.rate||7);
    let years=Number(req.body.years||2);

    let invest=amount>0?amount:income*0.2;

    let maturity=invest*Math.pow(1+rate/100,years);

    res.json({
        invest:Math.round(invest),
        maturity:Math.round(maturity),
        profit:Math.round(maturity-invest)
    });
});

// VEHICLE (CAR + BIKE)
app.post('/api/vehicle',(req,res)=>{
    let income=Number(req.body.income||0);

    let car="Tata Punch";
    let bike="TVS Apache";

    let carPrice=600000;
    let bikePrice=120000;

    let r=10/12/100,m=60;

    let carEMI=(carPrice*r*Math.pow(1+r,m))/(Math.pow(1+r,m)-1);
    let bikeEMI=(bikePrice*r*Math.pow(1+r,m))/(Math.pow(1+r,m)-1);

    res.json({
        car,
        bike,
        carEMI:Math.round(carEMI),
        bikeEMI:Math.round(bikeEMI),
        carTotal:Math.round(carEMI*m),
        bikeTotal:Math.round(bikeEMI*m),
        carImg:"https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
        bikeImg:"https://images.unsplash.com/photo-1580310614729-ccd69652491d"
    });
});

// REPORT
app.post('/api/report',(req,res)=>{
    let {income,food,travel,rent,shopping,other}=req.body;

    let total=food+travel+rent+shopping+other;
    let savings=income-total;

    res.json({
        report:`
INCOME: ₹${income}
EXPENSE: ₹${total}
SAVINGS: ₹${savings}

Breakdown:
Food ₹${food}
Travel ₹${travel}
Rent ₹${rent}
Shopping ₹${shopping}
Other ₹${other}

Advice:
Save 20% minimum, reduce unnecessary spending.
        `
    });
});

app.listen(3000,()=>console.log("🚀 FINAL SYSTEM RUNNING http://localhost:3000"));