package org.lia;

import com.fastcgi.FCGIInterface;

import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;


public class Main {

    private static final String HTTP_RESPONSE = """
        HTTP/1.1 200 OK
        Content-Type: application/json
        
        {
        "code":"%d",
        "result":"%s",
        "x":"%d",
        "y":"%.3f",
        "r":"%.1f",
        "time":"%s",
        "execution":"%d"
        }
        """;
    private static final String HTTP_ERROR = """
        HTTP/1.1 400 Bad Request
        Content-Type: application/json
        
        {
        "code":"%d",
        "result":"%s"
        }
        """;

    public static void main(String[] args) throws InterruptedException {
        var fcgiInterface = new FCGIInterface();
        while (fcgiInterface.FCGIaccept() >= 0) {
            if (FCGIInterface.request.params.getProperty("REQUEST_METHOD").equals("GET")) {
                java.util.Date startDate = new java.util.Date();
                String[] requestParams = FCGIInterface.request.params.getProperty("QUERY_STRING").split("&");
                int x;
                float y, r;
                try {
                    x = Integer.parseInt(requestParams[0].substring(2));
                    y = Float.parseFloat(requestParams[1].substring(2));
                    r = Float.parseFloat(requestParams[2].substring(2));
                    if (x < -4 || x > 4 || y < -5 || y > 3 || r < 1 || r > 3) {
                        throw new IndexOutOfBoundsException("Incorrect argument");
                    }
                } catch (NullPointerException | IndexOutOfBoundsException | NumberFormatException e) {
                    System.out.printf((HTTP_ERROR) + "%n", 400, "Некорректные параметры");
                    continue;
                }
                java.util.Date endDate = new java.util.Date();
                DateFormat df = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
                boolean res = false;
                if (x <= 0 & y >= 0 & x * x + y * y <= r * r / 4 ||
                        x <= 0 & y <= 0 & x >= -r & y >= -r ||
                        x >= 0 & y <= 0 & y >= x - r & x <= r
                ) {
                    res = true;
                }
                System.out.printf(
                        (HTTP_RESPONSE) + "%n",
                        200,
                        res,
                        x,
                        y,
                        r,
                        df.format(startDate),
                        (long)(endDate.getTime() - startDate.getTime())
                );
            }
        }
    }
}