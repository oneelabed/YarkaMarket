package students.student.student;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    public void addNewStudent(Student student) {
        Optional<Student> studentByUsername = studentRepository.findStudentByUsername(student.getEmail());

        if (studentByUsername.isPresent())
            throw new IllegalStateException("username taken");
        studentRepository.save(student);
    }

    public void deleteStudent(long id) {
        if (!studentRepository.existsById(id)) {
            throw new IllegalStateException("student with id " + id + "does not exist");
        }

        studentRepository.deleteById(id);
    }

    @Transactional
    public void updateStudent(long studentId, String username, String password) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalStateException(
                        "student with id " + studentId + " does not exist"));
        if (password != null && password.length() > 0 && !Objects.equals(student.getPassword(), password)) {
            student.setPassword(password);
        }

        if (username != null && username.length() > 0 && !Objects.equals(student.getEmail(), username)) {
            Optional<Student> studentByUsername = studentRepository.findStudentByUsername(student.getEmail());

            if (studentByUsername.isPresent())
                throw new IllegalStateException("username taken");
            student.setUsername(username);
        }
    }
}
