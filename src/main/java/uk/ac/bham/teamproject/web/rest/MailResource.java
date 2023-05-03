package uk.ac.bham.teamproject.web.rest;

import java.util.Date;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.bham.teamproject.service.MailService;
import uk.ac.bham.teamproject.service.dto.NewUrlDTO;
import uk.ac.bham.teamproject.service.dto.TodoItemDTO;

@RestController
@RequestMapping("/api/mail")
public class MailResource {

    private final MailService mailService;

    public MailResource(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/send-todo-completion-email")
    public ResponseEntity<Void> sendTodoDoneEmail(@RequestBody TodoItemDTO todoItemDTO) {
        String to = todoItemDTO.getUserEmail();
        String subject = "To-do Item Completed";
        String content = String.format(
            "<p>Hi,</p>" +
            "<p>You have completed the following to-do item:</p>" +
            "<p><strong>Heading:</strong> %s</p>" +
            "<p><strong>Description:</strong> %s</p>" +
            "<p><strong>Completed on:</strong> %s</p>" +
            "<p>Best regards,</p>" +
            "<p>AntiProcastApp Team</p>",
            todoItemDTO.getHeading(),
            todoItemDTO.getDescription(),
            new Date().toLocaleString()
        );

        mailService.sendEmail(to, subject, content, false, true);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-new-url-email")
    public ResponseEntity<Void> sendNewUrlEmail(@RequestBody NewUrlDTO NewUrlDTO) {
        String to = NewUrlDTO.getUserEmail();
        String subject = "New URL has been blocked";
        String content = String.format(
            "<p>Hi,</p>" +
            "<p>You have blocked the following website:</p>" +
            "<p><strong>Link:</strong> %s</p>" +
            "<p><strong>Type:</strong> %s</p>" +
            "<p><strong>Completed on:</strong> %s</p>" +
            "<p>Best regards,</p>" +
            "<p>AntiProcastApp Team</p>",
            NewUrlDTO.getLink(),
            NewUrlDTO.getType(),
            new Date().toLocaleString()
        );

        mailService.sendEmail(to, subject, content, false, true);
        return ResponseEntity.ok().build();
    }
}
