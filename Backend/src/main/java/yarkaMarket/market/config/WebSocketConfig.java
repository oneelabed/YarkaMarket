package yarkaMarket.market.config;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;
import yarkaMarket.market.Security.JwtTokenProvider;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@SuppressWarnings("null")
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    private final JwtTokenProvider jwtTokenProvider;
    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue", "/topic");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(frontendUrl)
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");

                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        try {
                            // Validate token using existing JwtTokenProvider
                            if (jwtTokenProvider.validateToken(token)) {
                                String email = jwtTokenProvider.getUsernameFromToken(token);
                                
                                // Create authentication token
                                UsernamePasswordAuthenticationToken authentication = 
                                    new UsernamePasswordAuthenticationToken(
                                        email, 
                                        null, 
                                        Collections.emptyList()
                                    );
                                
                                accessor.setUser(authentication);
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                                
                                System.out.println("WebSocket authenticated user: " + email);
                            } else {
                                System.err.println("Invalid JWT token for WebSocket connection");
                                return null;
                            }
                        } catch (Exception e) {
                            System.err.println("WebSocket authentication failed: " + e.getMessage());
                            return null;
                        }
                    } else {
                        System.err.println("No Authorization header in WebSocket connection");
                        return null;
                    }
                }
                return message;
            }
        });
    }
}