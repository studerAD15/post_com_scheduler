package com.postscheduler.backend.dto.post;

public class MediaAttachmentDto {
    private String id;
    private String name;
    private String type;
    private Long size;
    private String url;

    public MediaAttachmentDto() {}

    public MediaAttachmentDto(String id, String name, String type, Long size, String url) {
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
