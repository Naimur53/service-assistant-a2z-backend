const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const ObjectId = require("mongodb").ObjectId;
const fileUpload = require("express-fileupload");
const upload = require("./utils/multer");
const cloudinary = require("./utils/cloudinary");
const fs = require("fs");

// multer settings - by sagar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        const imageName = `service-request-${Date.now()}-${Math.round(
            Math.random() * 2000
        )}.${ext}`;

        cb(null, imageName);
    },
});
const uploadSagar = multer({ storage: storage });

// end of multer setting - by sagar

const app = express();
// nodemailer
const nodemailer = require("nodemailer");
// for socket
const http = require("http");
const { Server } = require("socket.io");
// external import
var allApi = require("./routes/allApi");
var ServicesApi = require("./routes/Services");
var UsersReviews = require("./routes/UsersReviews");
var SingleServiceDetails = require("./routes/ServiceDetails");
var adminRoute = require("./routes/adminRoute");
var allOrdersRoute = require("./routes/ordersRoute");
var headerBanner = require("./routes/headerBanners");
var NotificationRoute = require("./routes/notificationsRoute");
var allUsersRoute = require("./routes/allUsersRoute");
var chat = require("./routes/chat");
const provider = require("./routes/provider");
const { log } = require("console");
const NodeMailer = require("./routes/NodeMailer");
const serviceReqNodeMailer = require("./routes/serviceReqNodeMailer");
var Order = require("./routes/Order");
const saveService = require("./routes/saveService");
const serviceRequest = require("./routes/serviceRequest");
const AddProvider = require("./routes/AddProvider");
const ProviderDetails = require('./routes/ProviderDetails');
const AddQuestions = require('./routes/addQuestionsRouter');
// creating server with app var
const server = http.createServer(app);
const port = process.env.PORT || 5000;

//middleware
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// added and re-arranged middleware- by sagar
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
// app.use(fileUpload());

//io server
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
// socket io connection starts herebranch
io.on("connection", (socket) => {
    console.log("connected", socket.id);
    socket.on("joinAll", (allID) => {
        socket.join(allID);
        console.log(allID);
    });
    socket.on("join", (info) => {
        console.log("Joining ", info);
        socket.join(info.uid);
        !info.email && socket.broadcast.emit("user", info);
    });
    socket.on("message", (message) => {
        socket.to(message.uid).emit("get-message", message);
    });

    socket.on("notification", (info) => {
        // console.log(message);
        console.log(info);
        socket.to(info.email).emit("get-notification", info);
    });

    socket.on("leave", (id) => {
        console.log("leave", id);
        socket.leave(id);
    });
    socket.on("disconnect", () => {
        console.log("user disconnect", socket.id);
    });
});
const uri = process.env.MONGO_CONNECTION;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// all api using in this app ..
async function run() {
    try {
        await client.connect();
        console.log("database connected and working...");
        const database = client.db("service-assistant");
        const ServicesCollections = database.collection("Services");
        const allServicesCollection = database.collection("SingleServicesDetails");
        const allUsersCollection = database.collection("Users");
        const orderCollection = database.collection("Orders");
        app.use("/", allApi);

        // All Services APi
        app.use("/services", ServicesApi);
        app.use("/reviews", UsersReviews);
        app.use("/singleservice", SingleServiceDetails);
        app.use("/users", allUsersRoute);
        app.use("/admin", adminRoute);
        app.use("/orders", allOrdersRoute);
        app.use("/headerBanners", headerBanner);
        app.use("/notification", NotificationRoute);
        app.use("/serviceReqEmail", serviceReqNodeMailer);

        app.use("/sendEmail", NodeMailer);
        app.use("/myorder", Order);
        app.use("/saveservice", saveService);
        app.use("/provider", provider);
        app.use("/chat", chat);


        app.use('/servicerequest', serviceRequest)
        app.use('/addprovider', AddProvider);
        app.use('/providerdetials', ProviderDetails);
        app.use('/addquestions', AddQuestions);

        // make a service request API endpoint - by sagar
        app.post(
            "/api/v1/add-service-request",
            uploadSagar.array("images"),
            async (req, res) => {
                try {
                    //  destructring and parsing body stringify object
                    const allSer = JSON.parse(req.body.allServices);
                    req.body.FQA = JSON.parse(req.body.FQA);
                    req.body.overview = JSON.parse(req.body.overview);
                    req.body.mainFeatures = JSON.parse(req.body.mainFeatures);
                    req.body.Reviews = JSON.parse(req.body.Reviews);
                    req.body.serviceProvider = JSON.parse(req.body.serviceProvider);

                    // re-arranging serviceImage name and link
                    const mainImg = req.files.filter((item) => {
                        if (item.originalname === req.body.Img) {
                            return item.filename;
                        }
                    });
                    req.body.Img = `${req.protocol}://${req.headers.host}/images/${mainImg[0].filename}`;

                    // re-arranging service options image name and link
                    const newAllService = allSer.map((ele) => {
                        const name = req.files.filter((item) => {
                            if (item.originalname === ele.Image) {
                                return item.filename;
                            }
                        });
                        if (name.length > 0) {
                            ele.Image = `${req.protocol}://${req.headers.host}/images/${name[0].filename}`;
                        }
                        return ele;
                    });

                    req.body.allServices = newAllService;
                    req.body.pendingStatus = true;
                    req.body.createdAt = Date.now();
                    req.body.images = undefined;

                    // creating service request document
                    const requestedService = await allServicesCollection.insertOne(
                        req.body
                    );

                    if (requestedService.acknowledged) {
                        res.status(201).json({
                            status: "success",
                        });
                    }
                } catch (err) {
                    console.log(err);
                    res.status(500).json({
                        status: "fail",
                        err,
                    });
                }
            }
        );

        //    get all pending services - by sagar

        app.get("/api/v1/pending-services", async (req, res) => {
            try {
                // populating service provider and return pending request
                const pendingServicesData = allServicesCollection.aggregate([
                    {
                        $match: { pendingStatus: true },
                    },
                    {
                        $lookup: {
                            from: "Users",
                            localField: "serviceProvider",
                            foreignField: "uid",
                            as: "provider_info",
                        },
                    },
                ]);

                const pendingServices = await pendingServicesData.toArray();

                res.status(200).json({
                    data: pendingServices,
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: "fail",
                    err,
                });
            }
        });

        //    add service category page - by sagar

        app.post(
            "/api/v1/add-service-category",
            uploadSagar.single("Img"),
            async (req, res) => {
                try {
                    const newObj = { ...req.body };
                    // parsing stringify object
                    const serviceCategory = JSON.parse(req.body.Services);
                    newObj.Img = `${req.protocol}://${req.headers.host}/images/${req.file.filename}`;
                    newObj.Services = serviceCategory;

                    const newServiceCategory = await ServicesCollections.insertOne(
                        newObj
                    );
                    if (newServiceCategory.acknowledged) {
                        res.status(201).json({
                            status: "success",
                        });
                    }
                } catch (err) {
                    console.log(err);
                    res.status(500).json({
                        status: "fail",
                        err,
                    });
                }
            }
        );

        // update service category - by sagar
        app.patch("/api/v1/service-category/:id", async (req, res) => {
            try {
                let { id } = req.params;
                if (id.length > 4) {
                    id = ObjectId(id);
                } else {
                    id = parseInt(id);
                }
                const updatedCategory = ServicesCollections.updateOne(
                    { _id: id },
                    { $push: { Services: req.body } }
                );
                const updateSingleService = allServicesCollection.updateOne(
                    { _id: id },
                    { pendingStatus: false }
                );
                const values = await Promise.all([
                    updatedCategory,
                    updateSingleService,
                ]);
                console.log(id);
                console.log(req.body);
                console.log(values);
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: "fail",
                    err,
                });
            }
        });

        // for your section API endpoint

        app.get("/api/v1/for-your-home", async (req, res) => {
            try {

                const ids = [
                    "62377f8cfd7a8a3fc2658d5b",
                    "62377f8cfd7a8a3fc2658d5c",
                    "62377f8cfd7a8a3fc2658d5d",
                    "62377f8cfd7a8a3fc2658d5e",
                    "62377f8cfd7a8a3fc2658d5f",
                    "62377f8cfd7a8a3fc2658d60",
                ];
                const objectIds = ids.map((id) => {
                    return ObjectId(id);
                });

                const reultAggregate = allServicesCollection.aggregate([
                    {
                        $match: { _id: { $in: objectIds } },
                    },
                    {
                        $project: {
                            Category: "$Title",
                            Img: 1,
                            Id: `$_id`,
                        },
                    },
                ]);

                const result = await reultAggregate.toArray();

                console.log(result);
                res.status(200).json(
                    result
                );
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: "fail",
                    err,
                });
            }
        });

        // trending API
        app.get("/api/v1/trending", async (req, res) => {
            try {
                const Orders = orderCollection.aggregate([
                    {
                        $match: {},
                    },
                    {
                        $group: {
                            _id: "$mainId",
                            totalOrder: { $sum: 1 },
                        },
                    },
                    {
                        $sort: { totalOrder: -1 },
                    },
                    {
                        $limit: 5,
                    },
                    {
                        $lookup: {
                            from: "SingleServicesDetails",
                            foreignField: "_id",
                            localField: "_id",
                            as: "serviceInfo",
                        },
                    },
                    // {
                    //   $project: {
                    //     _id: "$serviceInfo.$._id",
                    //     Category: "$serviceInfo.$.Title",
                    //     Img: 1,
                    //   },
                    // },
                ]);

                const TrendingService = await Orders.toArray();
                console.log(TrendingService);
                res.send(TrendingService);
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: "fail",
                    err,
                });
            } finally {
            }



        })

    }
    finally {

    }
}
run().catch(e => console.log(e)).finally()

server.listen(port, () => {
    console.log(" This server is running at port ", port);
});
/*
git branch -a

git pull --all / git pull origin branchNamegit 
git branch -a (copy which one need to take)
git merge pasteLink like
 "remotes/heroku/main
  remotes/origin/development
  remotes/origin/main
  remotes/origin/naimur"
now add commit push 
git checkout main
git merge branchName(development)
now goto main branch to push into heroku

*/
