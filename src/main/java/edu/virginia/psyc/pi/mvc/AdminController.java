package edu.virginia.psyc.pi.mvc;

import edu.virginia.psyc.pi.persistence.ParticipantDAO;
import edu.virginia.psyc.pi.persistence.ParticipantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: dan
 * Date: 3/26/14
 * Time: 10:04 PM
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    private ParticipantRepository participantRepository;
    private static final Logger LOG = LoggerFactory.getLogger(AdminController.class);

    private static final int PER_PAGE=2;

    /**
     * Spring automatically configures this object.
     * You can modify the location of this database by editing the application.properties file.
     */
    @Autowired
    public AdminController(ParticipantRepository repository) {
        this.participantRepository   = repository;
    }

    @RequestMapping(method = RequestMethod.GET)
    public String listUsers(ModelMap model,
                            final @RequestParam(value = "page", required = false, defaultValue = "1") String pageParam) {

        Page<ParticipantDAO> participants;
        PageRequest pageRequest;
        int page = Integer.parseInt(pageParam);

        pageRequest = new PageRequest(page, PER_PAGE);

        participants = participantRepository.findAll(pageRequest);
        model.addAttribute("participants", participants);
        return "admin";

    }

}