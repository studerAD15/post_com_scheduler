package com.postscheduler.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class MediaAttachment {

    private String id;
    private String name;
    private String type; // MIME type e.g. "image/jpeg"
    private Long size;   // bytes

    @Column(length = 2048)
    private String url;

    public MediaAttachment() {}

    public MediaAttachment(String id, String name, String type, Long size, String url) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.url = url;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getSize() { return size; }
    public void setSize(Long size) { this.size = size; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
