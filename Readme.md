
# Advisor Dashboard
-------------

1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Integration](#integration)
4. [Usage](#usage)
   - [Initialization](#initialization)
   - [Maintenance](#maintenance)
5. [Contact Us](#contact-us)

## Introduction

The Advisor Dashboard is a LTI tool in canvas that allows Professional and Faculty advisers to view an overview of grades, assignments and attendance of all students and their courses in current semester. This tool appears as a separate course site in the canvas of professional and faculty advisers and is not visible to students or general faculty. Because student information is protected under the federal Family Educational Rights and Privacy Act (FERPA), only professional and faculty advisers have access to this tool. 


## Requirements
- Canvas
- EduAppCenter
- CSV file mapping Advisor(SIS ID) and Student(SIS ID)
## Integration
- Deploy the application on your school's server. You can follow this [guide][2]
- Generate a csv in the specified format containing SIS ID’s of the students and the advisor of record.
- Install the application on your own instance of EduAppCenter or use our default configured settings [here][3]. 
- Generate Developer Keys and Admin access token for the LTI by following steps [here][4] and [here][5].
- You need to update the variables with your values in config.js file under /config folder.
- Install the LTI on your instance of Canvas by following steps [here][6].

> **Note:**
> - Server must be secure in order for the LTI to work.
> - You can customize error page according to your needs.
> - We are using external csv to map students and their advisors as that information might not be latest on the Canvas.
> - You might need to make some changes in the authentication.js file inorder to match SIS ID mapping as per your institution.

## Usage
#### Initialization
>[User guide][7]
>[Demo video][8]
#### Maintenance
- You need to update the CSV file mapping Student(SIS ID) and Advisor(SIS ID) every term.


## Contact Us
Learning and Teaching Center  
Northwest Missouri State University  
800 University Drive  
Maryville, MO - 64468  

Email: [ltcite@nwmissouri.edu](ltcite@nwmissouri.edu)  
Phone: (660) 562-1532

[1]: https://canvas.instructure.com/
[2]: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
[3]: https://www.eduappcenter.com/tutorials/canvas
[4]: https://community.canvaslms.com/docs/DOC-10864-4214441833
[5]: https://community.canvaslms.com/docs/DOC-10806-4214724194
[6]: https://community.canvaslms.com/docs/DOC-10756-421474559
[7]: https://github.com/LTCITE/AdvisorDashboard/blob/master/userguide.pdf
[8]: https://youtu.be/hTm9iPIM-SM


