package uk.ac.bham.teamproject.service.dto;

public class NewUrlDTO {

    private String link;
    private String type;

    private String userEmail;

    // Getters and setters
    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
