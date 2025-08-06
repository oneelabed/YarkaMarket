package yarkaMarket.market.User;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import org.springframework.stereotype.Component;

@Component
public class RemoveWwwAuthFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) 
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        chain.doFilter(req, res);
        response.setHeader("WWW-Authenticate", ""); // Remove the header
    }
}
