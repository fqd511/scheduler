require("dotenv").config();
import { GFWCheckIn } from "./jobs/gfw";

// for locally debug
const username = process.env.GFW_USERNAME as string;
const pwd = process.env.GFW_PWD as string;

GFWCheckIn(username, pwd);
