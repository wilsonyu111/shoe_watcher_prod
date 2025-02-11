import smtplib, ssl
from email.message import EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
class sendEmail:


    
    port = 465
    server = ""
    user = ""
    password = ""
    context = None

    def __init__(self,user,password, port=465, server='smtp.gmail.com',):
        self.port = port
        self.server = server
        self.user = user
        self.password = password
    
    def basicMail(self,fromWho, toWho, subject, body):
        em = EmailMessage()
        em["From"] = fromWho
        em["To"] = toWho
        em["Subject"] = subject
        body = body
        em.set_content(body)

        self.__delieverMail__(fromWho=fromWho, toWho=toWho, emObj=em)
        
    def htmlMail(self, text, html, paramDic):
        em = EmailMessage()
        em = MIMEMultipart("alternative")
        fromWho = paramDic.get("sender")
        toWho = paramDic.get("toWho")
        em["From"] = fromWho
        em["To"] = toWho
        em["Subject"] = paramDic.get("subject")
        
        em.attach(MIMEText(text, "plain"))
        em.attach(MIMEText(html, "html"))
        

        self.__delieverMail__(fromWho=fromWho, toWho=toWho, emObj=em)
        


    def __delieverMail__(self,fromWho, toWho, emObj):

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(self.server, self.port, context=context) as smtp:
            print(self.user, self.password)
            print(fromWho, toWho, emObj)
            smtp.login(self.user, self.password)
            smtp.sendmail(fromWho, toWho, emObj.as_string())
    
    def send_confirmation_mail(self,paramDic):
        body = """
        this is a confirmation to you price watch subscription. \
        If there is a price drop, a notification email will be sent to this email.
        """

        html="""
        <html>
            <body>
                <br />
                <div>
                    This is a confirmation to you price watch subscription, all future price
                    drop email will be sent here.
                </div>
                <p>You subscribed to: {shoe_name}</p>
                <p>price to notify: ${price} or lower</p>
                <p>link to official page: <a href="{html_link}">link</a></p>
            </body>
        </html>
        """
        self.htmlMail(text=body, html=html.format(**paramDic), paramDic=paramDic)
    
    def send_price_email(self, paramDic):
        body = """
        this is a notification to you price subscription. \
        There is a price drop for the item you subscribed
        """
        html="""
        <html>
            <body>
                <br />
                <div>
                    There is a price drop for the item you subscribed   
                </div>
                <p>You subscribed to: {shoe_name}</p>
                <p>price you subscribed to: ${price} or lower</p>
                <p>current price: ${curr_price}</p>
                <p>link to official page: <a href="{html_link}">link</a></p>
            </body>
        </html>
        """
        self.htmlMail(text=body, html=html.format(**paramDic), paramDic=paramDic)
        print("email sent")
        
        
        
