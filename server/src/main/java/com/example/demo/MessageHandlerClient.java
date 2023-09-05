package com.example.demo;

import org.slf4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.JSONArray;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.CharsetUtil;

public class MessageHandlerClient {
    private final String ip;
    private final int port;
    private final Logger logger;
    private EventLoopGroup group;
    private Bootstrap bootstrap;
    private ChannelFuture channelFuture;

    public MessageHandlerClient(String ip, int port, FCListener listener, Logger logger) {
        this.ip = ip;
        this.port = port;
        this.logger = logger;

        group = new NioEventLoopGroup();
        bootstrap = new Bootstrap();
        bootstrap.group(group);
        bootstrap.channel(NioSocketChannel.class);
        bootstrap.option(ChannelOption.SO_KEEPALIVE, true);
        bootstrap.handler(new ChannelInitializer<SocketChannel>() {
            private String receivedMsg = "";

            @Override
            public void initChannel(SocketChannel ch) throws Exception {
                ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                    @Override
                    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                        try {
                            logger.info("MessageHandlerClient received data");
                            ByteBuf buf = (ByteBuf) msg;
                            receivedMsg += buf.toString(CharsetUtil.UTF_8);
                            int startIndex = receivedMsg.indexOf("<MSG>");
                            int endIndex = receivedMsg.indexOf("</MSG>");

                            // <MSG>{"event": /* event */, "data": /* data */ }</MSG>
                            while (startIndex != -1 && endIndex != -1 && startIndex < endIndex) {
                                String message = receivedMsg.substring(startIndex + 5, endIndex);

                                logger.info("MessageHandlerClient received message: " + message);
                                JSONObject jsonObject = JSONObject.parseObject(message);
                                String event = jsonObject.getString("event");
                                Object data_obj = jsonObject.get("data");
                                String data;
                                if (data_obj instanceof JSONObject) {
                                    data = jsonObject.getJSONObject("data").toJSONString();
                                } else if (data_obj instanceof JSONArray) {
                                    data = jsonObject.getJSONArray("data").toJSONString();
                                } else if (data_obj instanceof String) {
                                    data = jsonObject.getString("data");
                                } else if (data_obj instanceof Integer) {
                                    data = jsonObject.getInteger("data").toString();
                                } else if (data_obj instanceof Double) {
                                    data = jsonObject.getDouble("data").toString();
                                } else {
                                    data = "can't parse data in MessageHandlerClient yet";
                                }

                                listener.onMessage(event, data);

                                receivedMsg = receivedMsg.substring(endIndex + 6);
                                startIndex = receivedMsg.indexOf("<MSG>");
                                endIndex = receivedMsg.indexOf("</MSG>");
                            }
                        } catch (Exception e) {
                            logger.error("Exception: " + e.getMessage());
                        }
                    }
                });
            }
        });
    }

    public void connect() throws InterruptedException {
        while (true) {
            try {
                logger.info("MessageHandlerClient: try to connect to {}:{}", ip, port);
                channelFuture = bootstrap.connect(ip, port).sync();
                break;
            } catch (Exception e) {
                logger.error("Exception: " + e.getMessage());
            }
            Thread.sleep(1000);
        }
    }

    public void send(String msg) throws InterruptedException {
        if (channelFuture == null || !channelFuture.channel().isActive()) {
            logger.error("channelFuture is null or inactive");
            return;
        }
        msg = "<MSG>" + msg + "</MSG>";
        ByteBuf buf = Unpooled.copiedBuffer(msg, CharsetUtil.UTF_8);
        channelFuture.channel().writeAndFlush(buf).sync();
    }

    public void close() {
        if (channelFuture != null) {
            channelFuture.channel().close();
        }
        if (group != null) {
            group.shutdownGracefully();
        }
    }
}
