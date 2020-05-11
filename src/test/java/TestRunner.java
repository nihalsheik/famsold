import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.junit.runner.Description;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunListener;

public class TestRunner extends RunListener {

  private final Logger log = Logger.getLogger("TestRunner");

  public void testRunFinished(Result result) throws java.lang.Exception {
    log.info("-------------------------------------------");
    log.info("Number of testcases executed : " + result.getRunCount());
    log.info("Number of testcases success : " + String.valueOf(result.getRunCount() - result.getFailureCount()));
    log.info("Number of testcases failed : " + result.getFailureCount());
  }

  public void testFinished(Description description) throws java.lang.Exception {
    log.info("====>: " + description.getDisplayName());
  }

  @Override
  public void testFailure(Failure failure) throws Exception {
    log.info("FAIL " + failure.getMessage());
  }

  public void start() {
    JUnitCore runner = new JUnitCore();
    runner.addListener(this);
    runner.run(UnitTest.class);
  }

  public static void main(String[] args) {
    TestRunner runner = new TestRunner();
    runner.start();
  }
}
