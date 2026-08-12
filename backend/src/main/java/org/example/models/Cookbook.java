package org.example.models;

import java.util.Date;

public class Cookbook {
    private int id;

    private String name;

    private String description;

    private boolean isPublic;

    private String username;

    private Date createdAt;

    public Cookbook(){}

    public Cookbook(int id,String name, String description, boolean isPublic, String username, Date createdAt){
        this.id=id;
        this.name=name;
        this.description=description;
        this.isPublic=isPublic;
        this.username=username;
        this.createdAt=createdAt;
    }

    public int getId(){ return id;}

    public String getName(){return name;}

    public String getDescription(){return description;}

    public boolean getIsPublic(){return isPublic;}

    public String getUsername(){return username;}

    public Date getCreatedAt(){return createdAt;}

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setIsPublic(boolean isPublic) {
        this.isPublic=isPublic;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
