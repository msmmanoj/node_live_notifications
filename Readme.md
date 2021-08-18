# Node-live-notification

This is a sample application that sends Live Notification to admin each time 
when some user(who is not an admin) submit the form (Used Socket.io)

Install dependencies and run the application with this command:

```bash
npm install
npm run start

Application will be running on
http://localhost:8080/
```

## Project Details
Used fs(file service) as DB for storing submitted form details and static user details which will be used for logging into application


* Toastr
  #### Used toastr jquery library for showing toasts to admin when any user submits the form


### File Details
**users_data.json** contains name and passwords for user login and admin login

**form_data.json** contains submitted form details.

## Author

**Malepati Manoj**
* [github/msmmanoj](https://github.com/msmmanoj)

## License
Copyright © 2021 [Malepati Manoj](https://github.com/msmmanoj)
